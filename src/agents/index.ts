import { registry } from "../core/index.js";
import { ExplainAgent } from "./explain.js";
import { TestGenAgent } from "./test-gen.js";

registry.register(new ExplainAgent());
registry.register(new TestGenAgent());

export { ExplainAgent };
