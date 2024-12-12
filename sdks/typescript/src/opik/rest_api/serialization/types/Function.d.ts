/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { JsonObjectSchema } from "./JsonObjectSchema";
export declare const Function: core.serialization.ObjectSchema<serializers.Function.Raw, OpikApi.Function>;
export declare namespace Function {
    interface Raw {
        name?: string | null;
        description?: string | null;
        strict?: boolean | null;
        parameters?: JsonObjectSchema.Raw | null;
    }
}