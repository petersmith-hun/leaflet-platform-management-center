interface EntityDifferenceCalculator<ID> {

  /**
   * List of entity IDs to be attached.
   */
  attach: ID[];

  /**
   * List of entity IDs to be detached.
   */
  detach: ID[];
}

const collectIDsToAttach = <ID, M>(itemsAlreadyAttached: M[],
                                   itemAttachmentsRequested: ID[],
                                   idExtractor: (item: M) => ID): ID[] => {

  let idListToAttach: ID[];
  if (!itemsAlreadyAttached.length) {
    idListToAttach = itemAttachmentsRequested;
  } else {
    const alreadyAttached = itemsAlreadyAttached.map(idExtractor);
    idListToAttach = itemAttachmentsRequested
      .filter(itemID => !alreadyAttached.includes(itemID));
  }

  return idListToAttach;
}

const collectIDsToDetach = <ID, M>(itemsCurrentlyAttached: M[],
                                   itemAttachmentsRequested: ID[],
                                   idExtractor: (item: M) => ID): ID[] => {

  let idListToDetach: ID[] = [];
  if (itemsCurrentlyAttached.length) {
    const currentlyAttached = itemsCurrentlyAttached.map(idExtractor);
    idListToDetach = currentlyAttached
      .filter(itemID => !itemAttachmentsRequested.includes(itemID));
  }

  return idListToDetach;
}

/**
 * TODO.
 *
 * @param itemsAttached
 * @param itemAttachmentsRequested
 * @param idExtractor
 */
export const entityDifferentCalculator = <ID, M>(itemsAttached: M[], itemAttachmentsRequested: ID[],
                                                 idExtractor: (item: M) => ID): EntityDifferenceCalculator<ID> => {
  return {
    attach: collectIDsToAttach(itemsAttached, itemAttachmentsRequested, idExtractor),
    detach: collectIDsToDetach(itemsAttached, itemAttachmentsRequested, idExtractor)
  }
}
