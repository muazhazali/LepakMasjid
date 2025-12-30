import axios from "axios";
import * as cheerio from "cheerio";

export type SedekahQRResponse = {
  mosque: string;
  slug: string;
  svg: string;
};

export const sedekahApi = {
  async getQR(mosqueName: string): Promise<SedekahQRResponse> {
    const slug = mosqueName.trim().toLowerCase().replace(/\s+/g, "-");
    const url = `/sedekah-proxy/mosque/${slug}`;

    try {
      const res = await axios.get(url, {
        headers: {
          Accept: "text/html",
        },
      });

      const html = res.data;
      const $ = cheerio.load(html);

      const svg = $("button > div > svg").first();

      if (!svg.length) {
        throw new Error("QR Code SVG not found in response");
      }

      // Ensure it fills container
      svg.attr("class", "w-full h-full");

      return {
        mosque: mosqueName,
        slug,
        svg: $.html(svg),
      };
    } catch (error) {
      console.error("Error fetching QR code:", error);
      throw error;
    }
  },
};
