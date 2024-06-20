import * as xmlbuilder from "xmlbuilder";
import { defaults } from "./defs";

type Options = {
  attrkey: string;
  charkey: string;
  com: string;
  rootName: string;
  cdata: boolean;
  xmldec?: any;
  doctype?: any;
  headless?: boolean;
  allowSurrogateChars?: boolean;
  renderOpts?: any;
};

class Builder {
  private options: Options;

  constructor(opts: Partial<Options>) {
    this.options = { ...defaults["0.2"], ...opts };
  }

  private requiresCDATA(entry: any): boolean {
    return (
      typeof entry === "string" &&
      (entry.indexOf("&") >= 0 ||
        entry.indexOf(">") >= 0 ||
        entry.indexOf("<") >= 0)
    );
  }

  private wrapCDATA(entry: string): string {
    return "<![CDATA[" + this.escapeCDATA(entry) + "]]>";
  }

  private escapeCDATA(entry: string): string {
    return entry.replace("]]>", "]]]]><![CDATA[>");
  }

  buildObject(rootObj: Record<string, any>): string {
    const attrkey = this.options.attrkey;
    const charkey = this.options.charkey;
    const comment = this.options.com;
    let rootName = this.options.rootName;

    if (
      Object.keys(rootObj).length === 1 &&
      this.options.rootName === defaults["0.2"].rootName
    ) {
      rootName = Object.keys(rootObj)[0];
      rootObj = rootObj[rootName];
    }

    const render = (
      element: xmlbuilder.XMLElementOrXMLNode,
      obj: any
    ): xmlbuilder.XMLElementOrXMLNode => {
      if (typeof obj !== "object") {
        if (this.options.cdata && this.requiresCDATA(obj)) {
          element.raw(this.wrapCDATA(obj));
        } else {
          element.txt(obj);
        }
      } else if (Array.isArray(obj)) {
        for (const child of obj) {
          for (const key in child) {
            if (Object.prototype.hasOwnProperty.call(child, key)) {
              element = render(element.ele(key), child[key]).up();
            }
          }
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const child = obj[key];
            if (key === attrkey) {
              if (typeof child === "object") {
                for (const attr in child) {
                  if (Object.prototype.hasOwnProperty.call(child, attr)) {
                    const value = child[attr];
                    element = element.att(attr, value);
                  }
                }
              }
            } else if (key === charkey) {
              if (this.options.cdata && this.requiresCDATA(child)) {
                element = element.raw(this.wrapCDATA(child));
              } else {
                element = element.txt(child);
              }
            } else if (key === comment) {
              element.up().comment(child);
            } else if (Array.isArray(child)) {
              for (const entry of child) {
                if (typeof entry === "string") {
                  if (this.options.cdata && this.requiresCDATA(entry)) {
                    element = element.ele(key).raw(this.wrapCDATA(entry)).up();
                  } else {
                    element = element.ele(key, entry).up();
                  }
                } else {
                  element = render(element.ele(key), entry).up();
                }
              }
            } else if (typeof child === "object") {
              element = render(element.ele(key), child).up();
            } else {
              if (
                typeof child === "string" &&
                this.options.cdata &&
                this.requiresCDATA(child)
              ) {
                element = element.ele(key).raw(this.wrapCDATA(child)).up();
              } else {
                element = element
                  .ele(key, child == null ? "" : child.toString())
                  .up();
              }
            }
          }
        }
      }
      return element;
    };

    const rootElement = xmlbuilder.create(
      rootName,
      this.options.xmldec,
      this.options.doctype,
      {
        headless: this.options.headless,

        // allowSurrogateChars: this.options.allowSurrogateChars,
      }
    );

    return render(rootElement, rootObj).end(this.options.renderOpts);
  }
}

export { Builder };
