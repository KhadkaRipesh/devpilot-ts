import { registry } from "../core/index.js";
import { ExplainAgent } from "./explain.js";

registry.register(new ExplainAgent());

export { ExplainAgent };
