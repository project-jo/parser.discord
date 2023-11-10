import fs from "fs";
import yaml from "yaml";
import { parse } from "path";
import { checkFileSize } from "./file.js";

export function yamlToJson(yamlData: string, fileName: string) {
  const base_path = `${process.cwd()}/output/${fileName}.`;
  const inputPath = `${base_path}yaml`;
  const outputPath = `${base_path}json`;
  const jsonData = yaml.parse(yamlData);
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync(inputPath, yamlData, 'utf8');
  fs.writeFileSync(outputPath, jsonString, 'utf8');

  const inputFileData = checkFileSize(inputPath);
  const outputFileData = checkFileSize(outputPath);

  deleteFile(inputPath);

  return {
    input_data: inputFileData,
    output_data: outputFileData
  };
}

export function jsonToYaml(jsonData: string, fileName: string) {
  const base_path = `${process.cwd()}/output/${fileName}.`;
  const inputPath = `${base_path}json`;
  const outputPath = `${base_path}yaml`;
  const jsonObject = JSON.parse(jsonData);
  const doc = new yaml.Document();
  doc.contents = jsonObject;

  fs.writeFileSync(inputPath, jsonData, 'utf8');
  fs.writeFileSync(outputPath, doc.toString(), 'utf8');

  const inputFileData = checkFileSize(inputPath);
  const outputFileData = checkFileSize(outputPath);

  deleteFile(inputPath);

  return {
    input_data: inputFileData,
    output_data: outputFileData
  };
}

export function deleteFile(fileName: string) {
  fs.rmSync(fileName);
}

export function checkFile(path: string, fileName: string) {
  const ext = parse(path).ext.slice(1);
  let output = {
    status: false,
    output: "",
    extension_from: ext.toUpperCase(),
    extension_to: ext === 'yaml' ? 'JSON' : ext === 'json' ? 'YAML' : "",
  }
  if ((ext === 'yaml' || ext === 'yml')) {
    output.status = true
    output.output = `${process.cwd()}/output/${fileName}.json`
  } else if (ext === 'json') {
    output.status = true
    output.output = `${process.cwd()}/output/${fileName}.yaml`
  }
  return output;
}
