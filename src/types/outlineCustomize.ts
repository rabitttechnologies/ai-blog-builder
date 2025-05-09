export interface ArticleOutlineCustomization {
  generateHumanisedArticle: boolean;
  generateComparisonTable: boolean;
  includeExpertQuotes: boolean;
  includeImagesInArticle: boolean;
  imageType?: 'Copyright Image' | 'Non-Copyright';
  imageCount?: number;
  includeInternalLinks: boolean;
  internalLinkCount?: number;
  internalLinks?: string[];
  includeExternalLinks: boolean;
  externalLinkCount?: number;
  generateCoverImage: boolean;
  coverImageType?: string;
  coverImageSize?: string;
  includeCta: boolean;
  ctaText?: string;
  generateFaqs: boolean;
  faqCount?: number;
  includeGeneralGuidance: boolean;
  generalGuidance?: string;
}

export interface OutlineOption {
  id: string;
  content: string;
  parsed: {
    headings: {
      level: number;
      title: string;
    }[];
  };
}

export interface ArticleCustomizationPayload {
  workflowId: string;
  userId: string;
  sessionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  typeOfContent: string;
  mainKeyword: string;
  additionalKeyword: string[];
  references: { title: string; url: string }[];
  researchType: string;
  titlesAndShortDescription: {
    title: string;
    description: string;
  };
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: string;
  expertGuidance?: string;
  articleOutline: string;
  editedArticlePrompt: string;  // Will contain promptforbody from title description
  Introduction?: string;        // Added field for Introduction
  key_takeaways?: string;       // Added field for key_takeaways
  generateHumanisedArticle: boolean | null;
  generateComparisonTable: boolean | null;
  includeExpertQuotes: boolean | null;
  includeImagesInArticle: boolean | null;
  imageType?: string;
  imageCount?: number;
  includeInternalLinks: boolean | null;
  internalLinkCount?: number;
  internalLinks?: string[];
  includeExternalLinks: boolean | null;
  externalLinkCount?: number;
  generateCoverImage: boolean | null;
  coverImageType?: string;
  coverImageSize?: string;
  includeCta: boolean | null;
  ctaText?: string;
  generateFaqs: boolean | null;
  faqCount?: number;
  includeGeneralGuidance: boolean | null;
  generalGuidance?: string;
  additionalData?: any;
}

export interface ArticleCustomizationResponse {
  workflowId: string;
  userId: string;
  executionId: string;
  originalKeyword: string;
  country: string;
  language: string;
  typeOfContent: string;
  mainKeyword: string;
  additionalKeyword: string[];
  references: { title: string; url: string }[];
  researchType: string;
  titlesAndShortDescription: {
    title: string;
    description: string;
  };
  headingsCount: string;
  writingStyle: string;
  articlePointOfView: string;
  expertGuidance?: string;
  articleOutline: string;
  editedArticlePrompt: string;
  Introduction?: string;
  key_takeaways?: string;
  generateHumanisedArticle: boolean | null;
  generateComparisonTable: boolean | null;
  includeExpertQuotes: boolean | null;
  includeImagesInArticle: boolean | null;
  imageType?: string;
  imageCount?: number;
  includeInternalLinks: boolean | null;
  internalLinkCount?: number;
  internalLinks?: string[];
  includeExternalLinks: boolean | null;
  externalLinkCount?: number;
  generateCoverImage: boolean | null;
  coverImageType?: string;
  coverImageSize?: string;
  includeCta: boolean | null;
  ctaText?: string;
  generateFaqs: boolean | null;
  faqCount?: number;
  includeGeneralGuidance: boolean | null;
  generalGuidance?: string;
  generatedArticle?: string;
  additionalData?: any;
}
