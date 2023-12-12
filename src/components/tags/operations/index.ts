import { APIEnvironment } from "@/api-environment";
import { TagModel } from "@/core/model/tag";
import { KeyedMutator } from "swr";

/**
 * Parameters of operations available through the view tag screen.
 */
export interface ViewTagScreenParameters {
  tag: TagModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<TagModel>;
}
