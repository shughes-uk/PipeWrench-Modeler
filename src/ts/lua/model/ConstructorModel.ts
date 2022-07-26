import { DocBuilder } from '../../DocBuilder';
import { LuaClass } from '../LuaClass';
import { LuaConstructor } from '../LuaConstructor';
import { LuaMethod } from '../LuaMethod';
import { ClassModel } from './ClassModel';
import { ConstructorDoc, ConstructorDocJson } from './doc/ConstructorDoc';
import { Model } from './Model';
import { ParamModel, ParamModelJson } from './ParamModel';

/**
 * **ConstructorModel**
 *
 * @author JabDoesThings
 */
export class ConstructorModel extends Model<ConstructorModelJson> {
  /** (Loaded via {@link ModelUIManager}) */
  static HTML_TEMPLATE: string = '';

  readonly params: ParamModel[] = [];
  readonly doc: ConstructorDoc;
  readonly clazz: ClassModel;

  constructor(clazz: ClassModel, json?: ConstructorModelJson) {
    super();
    this.clazz = clazz;
    this.doc = new ConstructorDoc();
    if(clazz) this.create();
    if (json) this.load(json);

  }

  create() {
    const {_constructor_} = this.clazz.clazz;
    if(_constructor_) {
      for (const param of _constructor_.params) {
        this.params.push(new ParamModel(param));
      }
    }
  }

  load(json: ConstructorModelJson) {
    this.clear();
    if (json.doc) this.doc.load(json.doc);
    
    if (json.params && this.clazz._constructor_) {
      console.log('a');
      const {_constructor_} = this.clazz.clazz;
      console.log('b');

      if(json.params.length === _constructor_.params.length) {
        console.log('c', json.params.length);
        for (const param of json.params) this.params.push(new ParamModel(param));
        console.log('c2', this.params);
      } else {
        console.log('d');
        for (const param of _constructor_.params) {
          this.params.push(new ParamModel(param));
        }
        console.log('d2', this.params);
      }
    }
  }

  save(): ConstructorModelJson {
    const params: ParamModelJson[] = [];
    const doc: ConstructorDocJson = this.doc.save();
    return { doc, params };
  }

  clear() {
    this.doc.clear();
    this.params.length = 0;
  }

  generateDoc(prefix: string, _constructor_: LuaConstructor): string {
    if (!_constructor_ || !this.testSignature(_constructor_)) return '';

    const doc = new DocBuilder();
    const { doc: constructorDoc, params } = this;
    if (constructorDoc) {
      const { annotations, lines } = constructorDoc;

      // Process annotations. (If defined)
      if (annotations) {
        const keys = Object.keys(annotations);
        if (keys && keys.length) {
          for (const key of keys) doc.appendAnnotation(key, annotations[key]);
          doc.appendLine();
        }
      }

      // Process lines. (If defined)
      if (lines && lines.length) {
        for (const line of lines) doc.appendLine(line);
        doc.appendLine();
      }

      // Process params. (If defined)
      if (params) {
        for (const param of params) {
          const { name, doc: paramDoc } = param;

          if (!doc) {
            doc.appendParam(name);
            continue;
          } else {
            const { lines } = paramDoc;

            // No lines. Print basic @param <name>
            if (!lines || !lines.length) {
              doc.appendParam(name);
              continue;
            }

            doc.appendParam(name, lines[0]);

            // Check if multi-line.
            if (lines.length === 1) continue;
            for (let index = 1; index < lines.length; index++) {
              doc.appendLine(lines[index]);
            }
          }
        }
      }
    }
    return doc.build(prefix);
  }

  generateDom(): string {
    let dom = ConstructorModel.HTML_TEMPLATE;

    const replaceAll = (from: string, to: string) => {
      const fromS = '${' + from + "}";
      while (dom.indexOf(fromS) !== -1) dom = dom.replace(fromS, to);
    };

    let linesS = '';

    const { doc } = this;
    if(doc) {
      const { lines } = doc;
      if (lines) {
        linesS = '';
        for (const line of lines) linesS += `${line}\n`;
        linesS = linesS.substring(0, linesS.length - 1);
      }
    }

    let paramsS = '';
    console.log(this.params);
    if(this.params.length) {
      for(const param of this.params) {
        paramsS += param.generateDom();
      }
    }

    replaceAll('LINES', linesS);
    replaceAll('PARAMS', paramsS);

    return dom;
  }

  testSignature(_constructor_: LuaMethod): boolean {
    if (_constructor_.params.length !== this.params.length) return false;
    if (this.params.length) {
      for (let i = 0; i < this.params.length; i++) {
        if (!this.params[i].testSignature(_constructor_.params[i])) return false;
      }
    }
    return true;
  }
}

/**
 * **ConstructorModelJson**
 *
 * @author JabDoesThings
 */
export type ConstructorModelJson = {
  doc: ConstructorDocJson;
  params: ParamModelJson[];
};
