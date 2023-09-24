/* eslint-disable */

import * as sdk from "hypertune";







const queryCode = `query InitQuery {
  root {
    skipExpensiveAPICalls
  }
}
`;

const query = {"Query":{"objectTypeName":"Query","selection":{"root":{"fieldArguments":{"__isPartialObject__":true},"fieldQuery":{"Root":{"objectTypeName":"Root","selection":{"skipExpensiveAPICalls":{"fieldArguments":{},"fieldQuery":null}}}}}}}};



export const EnvironmentEnumValues = ["development", "production", "test"] as const;
export type Environment = typeof EnvironmentEnumValues[number];
  
export type Rec3 = {
  environment: Environment;
}

export type Rec2 = {
  context: Rec3;
}

export type Rec = {
  
}
  

  
export class RootNode extends sdk.Node {
  typeName = "Root" as const;

  skipExpensiveAPICalls(args: Rec = {}): sdk.BooleanNode {
        const props0 = this.getField("skipExpensiveAPICalls", args);
        const expression0 = props0.expression;

        if (
    expression0 &&
    expression0.type === "BooleanExpression"
    
    ) {
      return new sdk.BooleanNode(props0);
    }

    const node = new sdk.BooleanNode(props0);
    node._logUnexpectedTypeError();
    return node;
  
      }
}

export class QueryNode extends sdk.Node {
  typeName = "Query" as const;

  root(args: Rec2): RootNode {
        const props0 = this.getField("root", args);
        const expression0 = props0.expression;

                if (
    expression0 &&
    expression0.type === "ObjectExpression"
    && expression0.objectTypeName === "Root"
    ) {
      return new RootNode(props0);
    }

    const node = new RootNode(props0);
    node._logUnexpectedTypeError();
    return node;
  
      }
}

export function initializeHypertune(
  variableValues: Rec,
  options: sdk.InitializeOptions = {}
): QueryNode {
  const defaultOptions = {
    query
    
    
    ,queryCode
    ,variableValues
    
  }

  return sdk.initialize(
    QueryNode,
    
    { ...defaultOptions, ...options }
  );
}