/* ------------------------------------------------------------------
   All site content lives here. Edit this file, nothing else.
   Lines marked TODO are placeholders waiting for real content.
   ------------------------------------------------------------------ */
window.WEDDING = {
  couple: { a: "Shail", b: "Partner" },            // TODO partner's name
  city: "Ahmedabad",
  dateLine: "29 & 30 November 2026",
  invite: "Together with our families, we invite you to celebrate with us.", // TODO
  contact: [                                          // TODO logistics contacts shown in footer
    { name: "Shail", phone: "" },
  ],

  events: [
    {
      id: "mehendi",
      name: "Mehendi & Haldi",
      short: "Mehendi",
      dayLabel: "Sunday, 29 November",
      dateISO: "2026-11-29",
      start: "10:30 AM",
      end: "2:00 PM",
      venue: {
        name: "Gateway Hotel",
        address: "Sindhu Bhavan Road, Ahmedabad",
        lat: null, lng: null,                         // TODO coordinates from Shail
        mapsLink: null,                               // or a Google Maps share link
      },
      dress: "",                                      // TODO e.g. "Yellows and greens, comfortable cottons"
      about: "A relaxed morning of mehendi, haldi, music and lunch. Come early, stay for the food.", // TODO
      flow: [                                         // TODO sample flow, replace
        { t: "10:30 AM", title: "Haldi", note: "Ceremony begins" },
        { t: "11:30 AM", title: "Mehendi", note: "Artists available for all guests" },
        { t: "1:00 PM",  title: "Lunch" },
      ],
      art: "art/mehendi.jpg",
      // palette taken from the painting; wash = blurred copy used as page background
      wash: "art/mehendi-wash.jpg",
      palette: { bg: "#fbf3df", fg: "#5a3a16", accent: "#c9832a", accent2: "#7b8a3e", soft: "#f1e2bd" },
    },
    {
      id: "sangeet",
      name: "Sangeet",
      short: "Sangeet",
      dayLabel: "Sunday, 29 November",
      dateISO: "2026-11-29",
      start: "7:00 PM",
      end: "11:00 PM",
      venue: {
        name: "Saket 4 by FMS",
        address: "Ahmedabad",                         // TODO full address
        lat: null, lng: null,                         // TODO coordinates from Shail (do not look up)
        mapsLink: null,
      },
      dress: "",                                      // TODO
      about: "An evening of performances by family and friends, followed by dinner and an open dance floor.", // TODO
      flow: [                                         // TODO sample flow, replace
        { t: "7:00 PM", title: "Guests arrive", note: "Welcome drinks" },
        { t: "8:00 PM", title: "Performances" },
        { t: "9:30 PM", title: "Dinner and open floor" },
      ],
      art: "art/sangeet.jpg",
      wash: "art/sangeet-wash.jpg",
      palette: { bg: "#1c2b47", fg: "#eef1f5", accent: "#d5a860", accent2: "#5b8def", soft: "#28395a" },
    },
    {
      id: "wedding",
      name: "Wedding",
      short: "Wedding",
      dayLabel: "Monday, 30 November",
      dateISO: "2026-11-30",
      start: "2:30 PM",
      end: "11:00 PM",
      venue: {
        name: "Wedding venue",                        // TODO venue name
        address: "Ahmedabad",                         // TODO
        lat: null, lng: null,                         // TODO
        mapsLink: null,
      },
      dress: "",                                      // TODO
      about: "The baraat leaves from Shail's home in the afternoon and reaches the venue by evening. Hastmelap, dinner and vidaai follow.", // TODO
      flow: [
        { t: "2:30 PM",  title: "Baraat departs", note: "From Shail's home" },
        { t: "5:00 PM",  title: "Baraat arrives at the venue" },
        { t: "6:30 PM",  title: "Hastmelap" },
        { t: "7:00 PM",  title: "Dinner" },
        { t: "11:00 PM", title: "Vidaai" },
      ],
      art: "art/wedding.jpg",
      wash: "art/wedding-wash.jpg",
      palette: { bg: "#f3e9d8", fg: "#5a1e14", accent: "#8c2f1d", accent2: "#5f7a2d", soft: "#e8d9c2" },
    },
  ],
};
