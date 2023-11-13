import { Project } from "./project.types";

export interface Tender {
     _id: string;
     title: any;
     category: any;
     user: any;
     project: Project;
     shortDescription: any;
     description?: any;
     files: any[];
     image?: any;
     coverImage?: any;
     video?: any;
     createdAt: string;
     tenderNo: string;
     tenderRegistrationNo: string;
     requestNo: string;
     tenderStartDate: string;
     tenderEndDate: string;
     lastBidDate: string;
}
