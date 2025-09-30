export interface Operation {
  name: string;
  success: boolean;
  error?: string;
  subOps: Operation[];
}
