export const loadGeodata = async (
  places: string[],
  // eslint-disable-next-line no-undef
  updateGeoData: (data: GeoJSON.GeoJSON) => void,
  highRes: boolean = false,
): Promise<void> => {
  const scripts: HTMLScriptElement[] = [];
  const res = highRes ? "High" : "Low";

  try {
    await Promise.all(
      places.map(async (place) => {
        const script = document.createElement("script");
        script.src = `https://www.amcharts.com/lib/5/geodata/${place}${res}.js`;
        script.async = true;

        const promise = new Promise<void>((resolve, reject) => {
          script.onload = () => {
            const data =
              // @ts-expect-error: Accessing global variable
              window[`am5geodata_${place.replaceAll("/", "_")}${res}`];
            if (data) {
              updateGeoData(data);
              resolve();
            } else {
              reject(new Error(`No data found for ${place}`));
            }
          };
          script.onerror = () => {
            reject(new Error(`Failed to load script: ${script.src}`));
          };
        });

        document.body.appendChild(script);
        scripts.push(script);
        return promise;
      }),
    );
  } finally {
    // Clean up scripts if needed
    scripts.forEach((script) => {
      document.body.removeChild(script);
    });
  }
};
