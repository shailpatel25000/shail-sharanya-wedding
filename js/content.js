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
      // placeholder palette until the watercolour arrives; then sampled from the painting
      palette: { bg: "#f6efd2", fg: "#3a3416", accent: "#a67c12", accent2: "#5f7a2a", soft: "#ebe0ad" },
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
      palette: { bg: "#2b1639", fg: "#f6e9f8", accent: "#e8a6c9", accent2: "#c9a24e", soft: "#3f2452" },
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
      palette: { bg: "#7a1c25", fg: "#fcefe4", accent: "#e2b85c", accent2: "#f2d7a0", soft: "#92303a" },
    },
  ],
};
