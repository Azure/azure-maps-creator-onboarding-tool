export const AzureMapsProvider = ({ children }) => <div>{children}</div>;
export const AzureMap = ({ children, customControls, ...props }) => <div {...props}>{children}</div>;
export const AzureMapDataSourceProvider = ({ children, ...props }) => <div {...props}>{children}</div>;
export const AzureMapLayerProvider = ({ children, ...props }) => <div {...props}>{children}</div>;
export const AzureMapFeature = ({ children, setCoords, ...props }) => <div {...props}>{children}</div>;
