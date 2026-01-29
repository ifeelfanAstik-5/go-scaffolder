
export interface ProjectConfig {
  projectName: string;
  moduleName: string;
  architecture: 'Standard' | 'Clean' | 'Flat';
  features: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  files: GeneratedFile[];
}
