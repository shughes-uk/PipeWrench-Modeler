import { AuthoredDoc, AuthoredDocJson } from './AuthoredDoc';
import { ConstructorDoc, ConstructorDocJson } from './ConstructorDoc';
import { FieldDoc, FieldDocJson } from './FieldDoc';
import { MethodDoc, MethodDocJson } from './MethodDoc';

/**
 * **ClassDoc**
 *
 * @author JabDoesThings
 */
export class ClassDoc extends AuthoredDoc {
  annotations: { [annotation: string]: any } = {};
  fields: FieldDoc[] = [];
  methods: MethodDoc[] = [];
  readonly _constructor_: ConstructorDoc;

  constructor(json?: ClassDocJson) {
    super();
    if (json) this.load(json);
  }

  load(json: ClassDocJson) {
    super.load(json);
    this.annotations = json.annotations;
    this.fields = [];
    this.methods = [];
    for (const next of json.fields) this.fields.push(new FieldDoc(next));
    for (const next of json.methods) this.methods.push(new MethodDoc(next));
    this._constructor_.load(json._constructor_);
  }

  save(): ClassDocJson {
    const json = super.save() as ClassDocJson;
    json.annotations = this.annotations;
    json.fields = this.fields.map((next) => next.save());
    json.methods = this.methods.map((next) => next.save());
    json._constructor_ = this._constructor_.save();
    return json;
  }
}

/**
 * **ClassDocJson**
 *
 * @author JabDoesThings
 */
export type ClassDocJson = AuthoredDocJson & {
  annotations: { [annotation: string]: any };
  fields: FieldDocJson[];
  methods: MethodDocJson[];
  _constructor_: ConstructorDocJson;
};
