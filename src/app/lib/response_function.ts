import { ZodError } from "zod";

export function catchResponseFunction(error : any, message:string) {
  console.log(error);
    if (error instanceof ZodError) {
        return Response.json(
          { error: error.errors },
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Accept: "*/*",
            },
          }
        );
      }
      console.error(message, error);
      return Response.json(
        { error: "Internal Server Error" },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        });
}

export function tryResponseFunction(obj : any, statusCode : number){
  if (obj) {
    return Response.json(
       obj,
        {
          status: statusCode,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
    }else{
      return Response.json(
        null,
        {
          status: statusCode,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
    }
}



