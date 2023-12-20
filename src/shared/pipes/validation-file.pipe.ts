import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

interface IsFileOptions {
    mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

export function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
                        return true;
                    }                        
                    return false;
                },
            }
        });
    }
}


// export function IsImageFile(options?: ValidationOptions) {
//   return (object, propertyName: string) => {
//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options,
//       validator: {
//         validate(mimeType) {
//           console.log('sssss-------------------------------------------------s');
//           const acceptMimeTypes = ['image/png', 'image/jpeg','image/jpeg'];
//           const fileType = acceptMimeTypes.find((type) => type === mimeType);
//           return !fileType;
//         },
//       },
//     });
//   };
// }

export function IsImageFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsImageFile',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log('xxxx');
          const acceptMimeTypes = ['image/png', 'image/jpeg','image/jpeg'];
          const fileType = acceptMimeTypes.find((type) => type === value.mimeType);
          return !fileType;
        },
      },
    });
  };
}
