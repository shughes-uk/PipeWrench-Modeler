import { BaseDoc, BaseDocJson } from './BaseDoc';
import { ParamDoc, ParamDocJson } from './ParamDoc';

/**
 * **ConstructorDoc**
 *
 * @author JabDoesThings
 */
export class ConstructorDoc extends BaseDoc {
  annotations: { [annotation: string]: any } = {};
  params: ParamDoc[] = [];

  constructor(json?: ConstructorDocJson) {
    super();
    if (json) this.load(json);
  }

  load(json: ConstructorDocJson) {
    super.load(json);
    this.annotations = json.annotations;
    for (const next of json.params) this.params.push(new ParamDoc(next));
  }

  save(): ConstructorDocJson {
    const json = super.save() as ConstructorDocJson;
    json.annotations = this.annotations;
    json.params = this.params.map((param) => param.save());
    return json;
  }
}

/**
 * **ConstructorDocJson**
 *
 * @author JabDoesThings
 */
export type ConstructorDocJson = BaseDocJson & {
  annotations: { [annotation: string]: any };
  params: ParamDocJson[];
};
