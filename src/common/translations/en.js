const en = {
  translation: {
    'add.feature.class': 'Add feature class',
    'add.new.property': 'Add new property',
    'anchor.point.latitude': 'Anchor Point Latitude',
    'anchor.point.longitude': 'Anchor Point Longitude',
    'anchor.point.angle': 'Anchor Point Angle',
    'browse': 'Browse',
    'cancel': 'Cancel',
    'close': 'Close',
    'create': 'Create',
    'create.manifest': 'Create manifest',
    'create.new.manifest': 'Create a new manifest',
    'create.new.manifest.page.description': 'You will need to first submit your DWG files for processing to begin the onboarding process.',
    'delete.layer': 'Delete layer {{layerName}}',
    'delete.property': 'Delete property {{propertyName}}',
    'download': 'Download',
    'dwg.layers': 'DWG Layers',
    'dwg.zip.package': 'DWG ZIP package',
    'edit': 'Edit',
    'edit.existing.manifest': 'Edit an existing manifest',
    'enter.feature.class.name': 'Enter Feature Class Name',
    'enter.property.name': 'Enter Property Name',
    'error.empty.layers.dropdown': 'DWG file does not contain any usable layers.',
    'error.empty.text.layers.dropdown': 'DWG file does not contain any text entities.',
    'error.empty.feature.class.dropdown': 'A feature class must first be defined.',
    'error.field.is.required': 'This field is required.',
    'error.file.size.exceeded': 'The file is too big.',
    'error.file.type.incorrect': 'Please upload a {{type}} file.',
    'error.invalid.facility.name': 'Facility name cannot exceed 100 characters.',
    'error.invalid.level.name': 'Level name cannot exceed 100 characters.',
    'error.invalid.feature.class.name': 'Feature class name contains restricted characters.',
    'error.invalid.property.name': 'Property name contains restricted characters.',
    'error.layer.name.must.be.unique': 'Feature class name must be unique.',
    'error.layer.name.cannot.be.empty': 'Feature class name cannot be empty.',
    'error.layer.name.contains.illegal.characters': 'Feature class name cannot include invalid characters. Valid characters are: lower case characters (a-z), upper case characters (A-Z), numbers (0-9), and underscore character (\'_\').',
    'error.layer.name.not.allowed': 'Reserved feature class name. Please choose a different name.',
    'error.layer.name.should.begin.with.letter': 'Feature class name must begin with an upper case or lower case character.',
    'error.manifest.incorrect.version': 'Existing manifest provided is not supported. Only manifest version 2.0 or later is supported.',
    'error.manifest.invalid': 'Existing manifest provided is invalid.',
    'error.network.issue.cors': 'Unable to process your request due to a network issue or CORS is enabled for your Azure Maps account and a rule needs to be added for this tool.',
    'error.no.polygonLayerNames': 'DWG file(s) submitted must include a closed polygon entity representing the floor exterior.',
    'error.ordinal.must.be.unique': 'Ordinal value must be unique.',
    'error.ordinal.not.valid': 'The value must be a valid number between –1000 and 1000.',
    'error.prop.name.cannot.be.empty': 'Property name cannot be empty.',
    'error.prop.name.must.be.unique': 'Property name must be unique.',
    'error.prop.name.not.allowed': 'Reserved property name. Please choose a different name.',
    'error.prop.name.should.begin.with.letter': 'Property name must begin with an upper case or lower case character.',
    'error.prop.name.contains.illegal.characters': 'Property name cannot include invalid characters. Valid characters are: lower case characters (a-z), upper case characters (A-Z), numbers (0-9), and underscore character (\'_\').',
    'error.unexpected': 'An unexpected error has occurred.',
    'error.upload.file': 'Unable to upload the file successfully. Please try again.',
    'error.upload.file.processing': 'Processing your package has failed. Please try again.',
    'error.validation.failed.missing.info': 'Validation failed. Required information is missing or not valid.',
    'error.vertical.extent.not.valid': 'Vertical extent must be a valid number greater than 0 and less than 100.',
    'exterior.layer.not.selected.error': 'Please select \'exterior\' layer(s) to georeference your Facility',
    'exterior': 'Exterior',
    'facility.levels': 'Facility Levels',
    'facility.name': 'Facility name',
    'geography': 'Geography',
    'file.name': 'File name',
    'geography.europe': 'Europe',
    'geography.local': 'Local',
    'geography.unitedstates': 'United States',
    'geography.unitedstates.test': 'United States (Test)',
    'georeference': 'Georeference',
    'get.started': 'Get Started',
    'hide.control': 'Hide control',
    'home': 'Home',
    'home.page.description': 'A tool to help create a manifest that is required for the Creator Conversion service. For more information, see <0>Create Drawing Package</0>.',
    'latitude': 'Latitude',
    'layers.preview': 'Layers preview',
    'level.name': 'Level name',
    'level.name.of.file': 'Level name of {{filename}}',
    'longitude': 'Longitude',
    'manifest.file': 'Manifest file',
    'maps.creator.manifest.tool': 'Azure Maps Creator Onboarding Tool',
    'more.links': 'More links',
    'next': 'Next',
    'new.feature.class.name': 'New feature class name',
    'new.property.name': 'New property name',
    'navigational.breadcrumb': 'Navigational breadcrumb',
    'ordinal': 'Ordinal',
    'ordinal.of.file': 'Ordinal of {{filename}}',
    'page.description.levels': 'Each DWG file represents a single level within a facility.',
    'page.description.layers': 'Define and map feature classes to DWG layer(s). The Conversion service will produce an instance of a feature class object for each entity in the DWG layer. Additionally, you can define a property for the feature class that will be populated from DWG layers contain text entities. For example, a feature class could be called Spaces and have properties SpaceName and SpaceUseType.',
    'page.description.georeference': 'Accurately position the facility on the map to specify where the facility is located geographically and how much to rotate the facility. Values captured here will be used by the Conversion service to position the converted facility.',
    'position.building.footprint': 'Position Building Footprint',
    'previous': 'Previous',
    'process': 'Process',
    'process.file': 'Process file',
    'processing.label.processing': 'Processing your DWG files... This may take up to a couple minutes depending on the size of your files.',
    'processing.label.uploading': 'Uploading your DWG ZIP package...',
    'processing.last.checked': 'Last checked {{seconds}} secs ago',
    'review.download': 'Review + Download',
    'review.manifest': 'Review Manifest',
    'request.failed': 'Request failed. Please try again.',
    'rotation.in.degrees': 'Rotation in degrees',
    'save': 'Save',
    'search': 'Search',
    'search.address': 'Search Address',
    'search.by.building.address': 'Search by building address',
    'search.by.lon.lat': 'Search by longitude and latitude',
    'select.layers': 'Select Layers',
    'subscription.key': 'Subscription key',
    'toggle.control': 'Toggle control',
    'tooltip.geography': 'The geography of your Azure Maps Creator resource.',
    'tooltip.subKey': 'Your Azure Maps subscription key.',
    'tooltip.dwg.zip.package': 'A ZIP archive that contains all your Facility DWG drawing files.',
    'tooltip.level.name': 'Descriptive level name. For example: Floor 1, Lobby, Blue Parking, or Basement.',
    'tooltip.manifest.file': 'An existing manifest created using the DWG ZIP package.',
    'tooltip.ordinal': 'Determines the vertical order of levels.',
    'tooltip.vertical.extent': 'Floor-to-ceiling height (thickness) of the level in meters.',
    'upload': 'Upload',
    'vertical.extent': 'Vertical Extent',
    'vertical.extent.of.file': 'Vertical Extent of {{filename}}',
  },
};

export default en;