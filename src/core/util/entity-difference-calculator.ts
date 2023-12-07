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
 * "Calculates" the difference between the currently existing tag or file assignments and the requested state.
 * Based on the differences, it creates a list of IDs to be attached and another to be detached.
 *
 * @param itemsAttached current assignments
 * @param itemAttachmentsRequested requested assignments
 * @param idExtractor ID extraction function from the entity model
 */
export const entityDifferentCalculator = <ID, M>(itemsAttached: M[], itemAttachmentsRequested: ID[],
                                                 idExtractor: (item: M) => ID): EntityDifferenceCalculator<ID> => {
  return {
    attach: collectIDsToAttach(itemsAttached, itemAttachmentsRequested, idExtractor),
    detach: collectIDsToDetach(itemsAttached, itemAttachmentsRequested, idExtractor)
  }
}
