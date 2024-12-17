import { useCallback } from "react";
import { v7 } from "uuid";
import pick from "lodash/pick";

import useSpanCreateMutation from "@/api/traces/useSpanCreateMutation";
import useTraceCreateMutation from "@/api/traces/useTraceCreateMutation";
import { RunStreamingReturn } from "@/api/playground/useOpenApiRunStreaming";

import {
  PLAYGROUND_MODEL,
  PlaygroundPromptConfigsType,
  ProviderMessageType,
} from "@/types/playground";
import { useToast } from "@/components/ui/use-toast";
import { SPAN_TYPE } from "@/types/traces";

const PLAYGROUND_TRACE_SPAN_NAME = "chat_completion_create";

const USAGE_FIELDS_TO_SEND = [
  "completion_tokens",
  "prompt_tokens",
  "total_tokens",
];

const PLAYGROUND_PROJECT_NAME = "playground";

interface CreateTraceSpanParams extends RunStreamingReturn {
  model: PLAYGROUND_MODEL | "";
  providerMessages: ProviderMessageType[];
  configs: PlaygroundPromptConfigsType;
}

const useCreateOutputTraceAndSpan = () => {
  const { toast } = useToast();

  const { mutateAsync: createSpanMutateAsync } = useSpanCreateMutation();
  const { mutateAsync: createTraceMutateAsync } = useTraceCreateMutation();

  const createTraceSpan = useCallback(
    async ({
      startTime,
      endTime,
      result,
      usage,
      error,
      choices,
      model,
      providerMessages,
      configs,
    }: CreateTraceSpanParams) => {
      const traceId = v7();
      const spanId = v7();

      try {
        await createTraceMutateAsync({
          id: traceId,
          projectName: PLAYGROUND_PROJECT_NAME,
          name: PLAYGROUND_TRACE_SPAN_NAME,
          startTime,
          endTime,
          input: { messages: providerMessages },
          output: { output: result || error },
        });

        await createSpanMutateAsync({
          id: spanId,
          traceId,
          projectName: PLAYGROUND_PROJECT_NAME,
          type: SPAN_TYPE.llm,
          name: PLAYGROUND_TRACE_SPAN_NAME,
          startTime,
          endTime,
          input: { messages: providerMessages },
          output: { choices },
          usage: !usage ? undefined : pick(usage, USAGE_FIELDS_TO_SEND),
          metadata: {
            created_from: "openai",
            usage,
            model,
            parameters: configs,
          },
        });
      } catch {
        toast({
          title: "Error",
          description: "There was an error while logging data",
          variant: "destructive",
        });
      }
    },
    [createTraceMutateAsync, createSpanMutateAsync, toast],
  );

  return createTraceSpan;
};

export default useCreateOutputTraceAndSpan;