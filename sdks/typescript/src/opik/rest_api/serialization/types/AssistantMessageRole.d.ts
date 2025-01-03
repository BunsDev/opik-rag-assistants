/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
export declare const AssistantMessageRole: core.serialization.Schema<serializers.AssistantMessageRole.Raw, OpikApi.AssistantMessageRole>;
export declare namespace AssistantMessageRole {
    type Raw = "system" | "user" | "assistant" | "tool" | "function";
}
