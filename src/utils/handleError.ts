import { HttpError } from "@/http/http";
import { ResponError } from "@/type/ResponseType";
import toast from "react-hot-toast";
import { ZodError } from "zod";

export type FormState = {
    status: 'UNSET' | 'SUCCESS' | 'ERROR';
    message: string;
    fieldErrors: Record<string, string[] | undefined>;
    timestamp: number;
    serverError:any;
    data?:any
  };

  
  export const EMPTY_FORM_STATE: FormState = {
    status: 'UNSET' as const,
    message: '',
    fieldErrors: {},
    timestamp: Date.now(),
    serverError:""
  };
  
  export const fromErrorToFormState = (error: unknown) => {
    if (error instanceof ZodError) {
      return {
        status: 'ERROR' as const,
        message: '',
        fieldErrors: error.flatten().fieldErrors,
        timestamp: Date.now(),
        serverError:""
      };
    }
    else if (error instanceof HttpError) {
      return {
        status: 'ERROR' as const,
        message: error.message,
        fieldErrors: {},
        timestamp: Date.now(),
        serverError:error.payload
  
      };
    } else if (error instanceof Error) {
      return {
        status: 'ERROR' as const,
        message: error.message,
        fieldErrors: {},
        timestamp: Date.now(),
        serverError:error.message
      };
    }
     else {
      return {
        status: 'ERROR' as const,
        message: 'An unknown error occurred',
        fieldErrors: {},
        timestamp: Date.now(),
        serverError:"Error"
      };
    }
  };
  export const toFormState = (
    status: FormState['status'],
    message: string,data?:any
  ): FormState => {
    return {
      status,
      message,
      fieldErrors: {},
      timestamp: Date.now(),
      serverError:"",
      data
    };
  };

  // Handle Error Http
  export const handleErrorHttp = (dataErr : ResponError,txtWithStatus400?:string) => {
    if(!dataErr){
      toast.error("Có lỗi xảy ra")
      return "Có lỗi xảy ra";
    }
    const {Data,DevMessage,Message} = dataErr;
    const finalMess = Data || DevMessage || Message
    if(typeof finalMess === "string"){
      toast.error(finalMess)
      return finalMess;
    }
   const messError =(Array.isArray(finalMess) && finalMess.length > 0) ? finalMess[0] : "Có lỗi xảy ra";
   toast.error(messError)
   return messError;
  }