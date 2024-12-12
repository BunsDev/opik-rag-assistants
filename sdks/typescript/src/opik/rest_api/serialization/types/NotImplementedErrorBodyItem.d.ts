/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { ChatCompletionResponse } from "./ChatCompletionResponse";
import { ErrorMessage } from "./ErrorMessage";
export declare const NotImplementedErrorBodyItem: core.serialization.Schema<serializers.NotImplementedErrorBodyItem.Raw, OpikApi.NotImplementedErrorBodyItem>;
export declare namespace NotImplementedErrorBodyItem {
    type Raw = ChatCompletionResponse.Raw | ErrorMessage.Raw;
}