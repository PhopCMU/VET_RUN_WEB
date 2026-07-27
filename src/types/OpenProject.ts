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
