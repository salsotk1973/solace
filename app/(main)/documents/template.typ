#set page(
  width: 210mm,
  height: 297mm,
  margin: (
    x: 22mm,
    top: 24mm,
    bottom: 18mm,
  ),
  fill: rgb("FAFAF8"),
)

#set text(
  font: "Arial",
  size: 11pt,
  fill: rgb("1F2933"),
)

#set par(
  leading: 0.78em,
  justify: false,
)

#let solace-dark = rgb("1F2933")
#let solace-muted = rgb("6B7280")
#let solace-line = rgb("D9DEE4")
#let solace-paper = rgb("FAFAF8")
#let solace-box = rgb("F4F6F8")
#let solace-box-strong = rgb("FFFFFF")

#let brand = "SOLACE"

#let cover(title, subtitle) = [
  #set page(fill: solace-paper)

  #v(24mm)

  #align(center)[
    #text(size: 30pt, weight: "bold", fill: solace-dark, tracking: 0.08em)[#brand]

    #v(20mm)

    #text(size: 22pt, weight: "semibold", fill: solace-dark)[#title]

    #v(10mm)

    #text(size: 13pt, fill: solace-muted)[#subtitle]
  ]

  #pagebreak()
  #set page(fill: solace-paper)
]

#let section(title) = [
  #v(3mm)
  #text(size: 19pt, weight: "bold", fill: solace-dark)[#title]
  #v(4mm)
  #align(center)[
    #line(length: 42%, stroke: 1.1pt + solace-line)
  ]
  #v(8mm)
]

#let notebox(title, body) = [
  #block(
    fill: solace-box,
    stroke: 0.8pt + solace-line,
    inset: 11pt,
    radius: 12pt,
    width: 100%,
  )[
    #text(size: 11pt, weight: "semibold", fill: solace-dark)[#title]
    #v(5pt)
    #text(size: 10.5pt, fill: solace-dark)[#body]
  ]
]

#let actionstep(title, body, lines: 2) = [
  #block(
    fill: solace-box-strong,
    stroke: 1.15pt + solace-line,
    inset: 11pt,
    radius: 12pt,
    width: 100%,
  )[
    #text(size: 11pt, weight: "semibold", fill: solace-dark)[#title]
    #v(5pt)
    #text(size: 10.5pt, fill: solace-dark)[#body]
    #v(9pt)

    #for i in range(lines) [
      #line(length: 100%, stroke: 0.55pt + solace-line)
      #if i < lines - 1 [
        #v(7mm)
      ]
    ]
  ]
]

#let reflection(question, lines: 4) = [
  #v(4mm)
  #text(size: 12pt, weight: "semibold", fill: solace-dark)[Reflection]
  #v(3pt)
  #text(size: 11pt, fill: solace-dark)[#question]
  #v(7mm)

  #for i in range(lines) [
    #line(length: 100%, stroke: 0.55pt + solace-line)
    #if i < lines - 1 [
      #v(8mm)
    ]
  ]
]

#let comparison-column(title, lines: 4) = [
  #text(size: 11pt, weight: "semibold", fill: solace-dark)[#title]
  #v(10pt)

  #for i in range(lines) [
    #line(length: 100%, stroke: 0.55pt + solace-line)
    #if i < lines - 1 [
      #v(12mm)
    ]
  ]
]

#let comparison(title, left-title, right-title) = [
  #v(4mm)
  #text(size: 12pt, weight: "semibold", fill: solace-dark)[#title]
  #v(5mm)

  #block(
    fill: solace-box-strong,
    stroke: 1.15pt + solace-line,
    inset: 0pt,
    radius: 12pt,
    width: 100%,
    clip: true,
  )[
    #grid(
      columns: (1fr, 1fr),
      column-gutter: 0pt,
      row-gutter: 0pt,

      [
        #block(
          inset: 12pt,
          stroke: (
            right: 0.8pt + solace-line,
          ),
        )[
          #comparison-column(left-title)
        ]
      ],
      [
        #block(inset: 12pt)[
          #comparison-column(right-title)
        ]
      ],
    )
  ]
]

#let document(title, subtitle, body) = [
  #cover(title, subtitle)
  #body
]