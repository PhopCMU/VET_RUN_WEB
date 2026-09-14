export interface OpenProject {
  description: string;
  name: string;
  status: boolean;
}

export interface limitAnimal {
  canRegister: boolean;
  success: boolean;
  fancy: {
    current: number;
    limit: number;
    status: boolean;
  };
  not_fancy: {
    current: number;
    limit: number;
    status: boolean;
  };
}

export interface Sponsor {
  sponsorId: string;
  name: string;
  image: string;
  link: string;
  price: string;
  type: string;
}

export interface RegistrationAnimal {
  name: string;
  breed: string;
  weight: string;
  gender?: string;
  sex?: string;
  fancys: boolean;
}

export interface RegistrationFormData {
  eventType: string;
  subOption: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  age: string;
  sizeId: string;
  shirtSizeLabel?: string;
  shirtSizeLabel_2?: string;
  items?: string;
  model_shirt?: string;
  sizeId_2?: string;
  address: string;
  needReceipt: boolean;
  transferFile: File | null;
  payment: boolean;
  animal: RegistrationAnimal;
  hasDog: boolean;
  prevStep: number;
}

export interface TrackingOrder {
  fullname?: string;
  email?: string;
  phone?: string;
  payment?: boolean;
  sh_collection_method?: string;
  ems_tracking?: string;
  orderItemCount?: number;
  createdAt?: string;
}

export interface Participant {
  participantId?: string;
  firstName?: string;
  lastName?: string;
  numberBib?: string;
  nameBib?: string;
  typeBib?: string;
  payment?: boolean;
}
