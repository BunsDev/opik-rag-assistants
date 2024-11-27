/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { CategoricalFeedbackDetailPublic } from "./CategoricalFeedbackDetailPublic";
export declare const CategoricalFeedbackDefinitionPublic: core.serialization.ObjectSchema<serializers.CategoricalFeedbackDefinitionPublic.Raw, OpikApi.CategoricalFeedbackDefinitionPublic>;
export declare namespace CategoricalFeedbackDefinitionPublic {
    interface Raw {
        details?: CategoricalFeedbackDetailPublic.Raw | null;
        created_at?: string | null;
        created_by?: string | null;
        last_updated_at?: string | null;
        last_updated_by?: string | null;
    }
}