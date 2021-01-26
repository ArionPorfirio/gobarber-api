interface IParseMailTemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: IParseMailTemplateVariables;
}
