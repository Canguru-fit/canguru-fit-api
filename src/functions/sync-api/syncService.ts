import { Request } from 'express';
import bookingsModel from '../../schemas/bookings.model';
import propertiesModel from '../../schemas/properties.model';
import tokensModel from 'src/schemas/tokens.model';
import axios from 'axios';

export const syncBooking = async (req: Request): Promise<any> => {
  const bookingId = req.body.bookId

  if (!bookingId) {
    throw new Error('Missing booking id')
  }

  let response = null

  const token = await tokensModel.findOne().sort({createdAt: -1});

  try {
    response = await axios.get(`https://beds24.com/api/v2/bookings?id=${bookingId}`, {
    headers: {
      token: token.token
    }
  })
  } catch (error) {
    throw new Error(`There was a problem fetching the booking: ${error.message}`)
  }


  const [booking] = response.data.data

  console.log('Book to sync', booking)

  const hasBooking = await bookingsModel.exists({ id: bookingId })

  try {
    if (hasBooking)
      if (booking)
        return await bookingsModel.updateOne({ id: bookingId }, booking)
      else
        return await bookingsModel.updateOne({ id: bookingId }, {status: 'cancelled'})
    else
      return await bookingsModel.create(booking);
  } catch (error) {
    throw new Error(`There was an error while saving the synced booking: ${error.message}`)
  }
};


export const syncProperty = async (req: Request): Promise<any> => {
  const propertyId = req.body.propId

  if (!propertyId) {
    throw new Error('Missing property id')
  }

  let response = null

  const token = await tokensModel.findOne().sort({createdAt: -1});

  try {
    response = await axios.get(`https://beds24.com/api/v2/properties?id=${propertyId}&includeAllRooms=true&includeUnitDetails=true`, {
    headers: {
      token: token.token
    }
  })
  } catch (error) {
    throw new Error(`There was a problem fetching the booking: ${error.message}`)
  }


  const [property] = response.data.data

  console.log('Property to sync', property)

  const hasProperty = await propertiesModel.exists({ id: propertyId })

  try {
    if (hasProperty)
        return await propertiesModel.updateOne({ id: propertyId }, property)

    return await propertiesModel.create(property);
  } catch (error) {
    throw new Error(`There was an error while saving the synced property: ${error.message}`)
  }
};


export const syncProperties = async (_req: Request): Promise<any> => {
  let response = null

  const token = await tokensModel.findOne().sort({createdAt: -1});

  try {
    response = await axios.get(`https://beds24.com/api/v2/properties?includeAllRooms=true&includeUnitDetails=true`, {
    headers: {
      token: token.token
    }
  })
  } catch (error) {
    throw new Error(`There was a problem fetching properties: ${error.message}`)
  }


  const properties = response.data.data

  console.log('Properties from beds24', properties)


  // ** nao apagar e categorias unidades deletadas do banco

  for (const property of properties) {
    const hasProperty = await propertiesModel.exists({ id: property.id })

    try {
      if (hasProperty)
        await propertiesModel.updateOne({ id: property.id }, property)
      else
        await propertiesModel.create(property);
    } catch (error) {
      throw new Error(`There was an error while saving the synced property: ${property.id} - ${property.name}: ${error.message}`)
    }
  }

  return true
};





