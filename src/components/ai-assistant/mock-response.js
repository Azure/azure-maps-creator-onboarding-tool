export const mockData = {
  layerDescriptions: [
    {
      layerName: 'P-FIXT-EXST',
      layerDescription:
        'The DWG layer P-FIXT-EXST pertains to existing plumbing fixtures. The image displays symbols representing various plumbing fixtures, consistent with an existing conditions layout for plumbing in a built environment.',
    },
    {
      layerName: 'A-GLAZ-EXST',
      layerDescription:
        'The DWG layer A-GLAZ-EXST is an architectural layer showing existing glazing details, which includes lines and shapes representing glass panels, in the current state of the project.',
    },
    {
      layerName: 'A-FLOR-CORE-STRS-EXST',
      layerDescription:
        'The layer A-FLOR-CORE-STRS-EXST represents the existing stair cores on an architectural floor plan. The "EXST" denotes that these features are currently existing structures within the building.',
    },
    {
      layerName: 'A-WALL-CORE-EXST',
      layerDescription:
        'The layer A-WALL-CORE-EXST contains existing core walls and includes features such as Restrooms, areas to be confirmed (TBC), and Vertical Penetrations indicative of multi-floor access points within a structure.',
    },
    {
      layerName: 'A-FLOR-CORE-HRAL-EXST',
      layerDescription:
        'The layer A-FLOR-CORE-HRAL-EXST concerns architectural floor planning, specifically central or essential aspects of the floor layout that are existing. It includes indications for Stairwell Exits and dashed lines marked "TBC" representing areas or features pending confirmation.',
    },
    {
      layerName: 'E-POWR-FLOR-EXST',
      layerDescription:
        'This layers name suggests that it pertains to existing (EXST) electrical (E) power (POWR) features located on a floor (FLOR). The image shows a series of symbols that are typically used to represent electrical fixtures such as outlets and switches at their precise locations on a floor plan.',
    },
    {
      layerName: 'A-GLAZ-SILL-EXST',
      layerDescription:
        'This layer shows the existing architectural details of window sills related to glazing within a drawing. It contains lines and annotations for indicating window sill locations and dimensions.',
    },
    {
      layerName: 'A-FLOR-HRAL-EXST',
      layerDescription:
        'The layer A-FLOR-HRAL-EXST represents existing handrails. The parallel lines with breaks represent sections of handrails, possibly alongside a staircase due to their orderly placement.',
    },
    {
      layerName: 'A-DOOR-SHEL-EXST',
      layerDescription:
        'The layer A-DOOR-SHEL-EXST pertains to architectural elements, focusing on the existing doors and associated shelving details. The features include door symbols and shelving outlines, defining their location and arrangement within an existing building or space.',
    },
    {
      layerName: 'GROS$TXT',
      layerDescription:
        'The DWG layer GROS$TXT is associated with gross area/ground cover text annotations or labels. The layer includes multiple text elements as observed in the image.',
    },
    {
      layerName: 'A-GLAZ-SHEL-SILL-EXST',
      layerDescription:
        'The layer A-GLAZ-SHEL-SILL-EXST represents existing architectural glazing features, specifically shelving sills, in the building plan. This description was derived from the DWG layer naming convention and the visual elements identified in the provided image.',
    },
    {
      layerName: 'RM$',
      layerDescription:
        'The layer RM$ appears to represent the layout of rooms and related features within a building. "RM" suggests a focus on rooms, while the "$" in the layer name is undefined. The layer contains an array of room types and spaces such as offices, conference areas, restrooms, and specialized spaces necessary for the building\'s operation and occupants\' welfare.',
    },
  ],
  layerMappings: [
    {
      featureClass: 'FloorOutline',
      layers: ['GROS$', 'GROS', 'A-FLOR-CORE-STRS-EXST', 'A-FLOR-CORE-HRAL-EXST', 'A-FLOOR-CORE-LEVL-EXST'],
    },
    {
      featureClass: 'Rooms',
      layers: ['RM', 'RM$', 'A-BOMA'],
    },
    {
      featureClass: 'Walls',
      layers: ['A-WALL-EXST', 'A-WALL-SHEL-EXST', 'A-WALL-CORE-EXST', 'A-WALL-CORE-HEAD-EXST'],
    },
    {
      featureClass: 'Elevator',
      layers: ['S-COLS-EXST', 'A-WALL-CORE-EXST', 'A-FLOR-CORE-STRS-EXST'],
    },
    {
      featureClass: 'Stairs',
      layers: ['A-FLOR-HRAL-EXST', 'A-FLOR-CORE-STRS-EXST', 'A-FLOR-CORE-HRAL-EXST', 'A-FLOR-CORE-EVTR-EXST'],
    },
    {
      featureClass: 'Glass',
      layers: ['A-GLAZ-EXST', 'A-GLAZ-SHEL-EXST', 'A-GLAZ-SILL-EXST', 'A-GLAZ-CORE-EXST', 'A-GLAZ-CORE-SILL-EXST'],
    },
    {
      featureClass: 'Windows',
      layers: ['A-GLAZ-EXST', 'A-GLAZ-SILL-EXST', 'A-GLAZ-CORE-EXST', 'A-GLAZ-CORE-SILL-EXST'],
    },
    {
      featureClass: 'Sills',
      layers: ['A-GLAZ-SILL-EXST', 'A-GLAZ-CORE-SILL-EXST', 'A-GLAZ-SHEL-SILL-EXST'],
    },
    {
      featureClass: 'Shelves',
      layers: ['A-GLAZ-SHEL-EXST', 'A-DOOR-SHEL-EXST', 'A-WALL-SHEL-EXST', 'A-FLOR-SHEL-HRAL-EXST'],
    },
  ],
};
