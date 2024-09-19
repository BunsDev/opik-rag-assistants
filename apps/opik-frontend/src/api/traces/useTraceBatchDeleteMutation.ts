import { useMutation, useQueryClient } from "@tanstack/react-query";
import get from "lodash/get";
import { useToast } from "@/components/ui/use-toast";
import api, { TRACES_REST_ENDPOINT } from "@/api/api";

type UseTraceBatchDeleteMutationParams = {
  ids: string[];
  projectId: string;
};

const useTracesBatchDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ids }: UseTraceBatchDeleteMutationParams) => {
      const { data } = await api.post(`${TRACES_REST_ENDPOINT}delete`, {
        ids: ids,
      });
      return data;
    },
    onError: (error) => {
      const message = get(
        error,
        ["response", "data", "message"],
        error.message,
      );

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["spans", { projectId: variables.projectId }],
      });
      queryClient.invalidateQueries({ queryKey: ["compare-experiments"] });
      queryClient.invalidateQueries({
        queryKey: [
          "traces",
          {
            projectId: variables.projectId,
          },
        ],
      });
    },
  });
};

export default useTracesBatchDeleteMutation;