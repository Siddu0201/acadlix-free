import { saveAs } from "file-saver";

export const useJsonExport = (
    defaultData = [],
    defaultOptions = {}
) => {

    const exportJson = (
        fileName = "export.json",
        override = {}
    ) => {

        const options = {
            pretty: true, // formatted JSON
            transform: (data) => data, // allow data modification
            rootKey: null, // wrap inside object if needed
            ...defaultOptions,
            ...override.options,
        };

        let data = override.data || defaultData;

        /** Allow transforming data before export */
        if (typeof options.transform === "function") {
            data = options.transform(data);
        }

        /** Optional root wrapping */
        if (options.rootKey) {
            data = {
                [options.rootKey]: data,
            };
        }

        const jsonString = JSON.stringify(
            data,
            null,
            options.pretty ? 2 : 0
        );

        const blob = new Blob([jsonString], {
            type: "application/json",
        });

        saveAs(blob, fileName);
    };

    return exportJson;
};