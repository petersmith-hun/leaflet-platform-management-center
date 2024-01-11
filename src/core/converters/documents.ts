import { ResponseWrapper } from "@/core/model/common";
import { DocumentEditRequest, DocumentModel } from "@/core/model/document";

/**
 * Converts the given wrapped DocumentModel to DocumentEditRequest model for usage on the document editor.
 *
 * @param document document data to be converted
 */
export const convertDocumentToEditRequest = (document: ResponseWrapper<DocumentModel>): DocumentEditRequest => {

  return {
    title: document.body.title,
    link: document.body.link,
    locale: document.body.locale,
    rawContent: document.body.rawContent,
    enabled: document.body.enabled,
    metaTitle: document.seo.metaTitle,
    metaDescription: document.seo.metaDescription,
    metaKeywords: document.seo.metaKeywords ?? ""
  }
}
