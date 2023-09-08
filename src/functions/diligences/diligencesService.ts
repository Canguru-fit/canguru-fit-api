import diligencesModel from '../../schemas/diligences.model';


export const read = async (): Promise<any> => {
  return diligencesModel.find();
};

export const readOne = async (id: String): Promise<any> => {
  return diligencesModel.findById(id);
};

export const create = async (diligence: ): Promise<any> => {
  return diligencesModel.create(diligence);
};


