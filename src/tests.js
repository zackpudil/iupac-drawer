export const tests = [
  //alkanes
  'octane', // 0
  '6-methyloctane', // 1
  '4-ethyl-2,3-dimethyloctane', // 2
  '2-(2,3-diethylhexyl)octane', // 3
  '2-(2,3-diethylhexyl)-3-methyloctane', // 4
  '4-(2-propenyl)octane', // 5
  '7-propyl-3-(1-ethylpropyl)-6-ethyl-4-(1,1-dimethylethyl)-5-(2-propenyl)octane', //6
  '5-(3,4-hexadienyl)octane', // 7
  //alkenes
  '3-octene', // 8
  '4-methyl-3-octene', // 9 
  '4-ethyl-2,3-dimethyl-6-octene', // 10
  '2-(2,3-diethylhexyl)-5-octene', // 11
  '2-(2,3-diethylhexyl)-3-methyl-6-octene', // 12
  '3,5-octadiene', // 13
  '2-methyl-3,5-octadiene', // 14
  '5,3-(2,4-hexadienyl)-3,5-octadiene', // 15
  '2-methyl-5-(2,3-diethyl-2-butenyl)-5-octene', // 16
  '4-(2,3,4,5-tetraethyl-2,4-hexadienyl)-pentane', // 17
  //alkynes
  '4-ethyl-3,5,9-trimethyl-8-propyl-2,8-decadien-6-yne', // 18
  '4-ethyl-3,5,9-trimethyl-8-propyl-2-(2,3,4-triethyl-3,5-hexadienyl)-2,8-decadien-6-yne', // 19
  '4-ethyl-3,5,9-trimethyl-8-propyl-2,3,5-(2,3,4-triethylhexyl)-2,8-decadien-6-yne', // 20
  '2-(3,4,5-triethyl-2,4-hexadienyl)-4-octyne', // 21
  '2-(2,3,4-triethyl-2,4,6-heptatrienyl)-3,6-decadiyne', // 22
  // cycloalkanes
  'cyclobutane', // 23
  'cyclopentane', // 24
  'cyclohexane', // 25
  '2,3-(1-ethenyl)cyclobutane', // 26
  '2-ethyl-4-propylcyclopentane', // 27
  '1,3-dimethylcyclohexane', // 28
  // cycloalkenes
  '2,4-cyclopentadiene', // 29
  '4-(2-propenyl)-2,4-cyclopentadiene', // 30
  '1,3,5-cyclohexatriene', // 31
  '1,3-dimethyl-2,4-diethyl-5-(2-propenyl)-6-(1,3-butadienyl)-1,3,5-cyclohexatriene', // 32 
  '2,5-(1,3,5-cyclohexenyl)-8-(2-cyclopropylpropyl)-9-cyclopentyl-4-ethyl-3-methyl-2,8-decadien-6-yne', //33
  // halides
  '2-bromo-3-chlorobutane', // 34
  '3-(3-chloro-2-bromo-1-propenyl)-2-bromo-1-chloro-4-iodobutane', // 35
  '3-bromo-2-chloro-4,5-difluoro-4-hexene', //36
  '4,8-dibromo-2,9-dichloro-3,5-difluoro-4,8-decadiene', //37
  '1-bromo-2-chloro-3-iodo-4-fluorocyclohexane', // 38
  '1,5-dibromo-2-chloro-4-fluoro-3,6-diiodocyclohexane', // 39
  '2,5-(4-bromo-1,3,5-cyclohexenyl)-8-(1-iodo-2-cyclopropylpropyl)-9-(2,4-difluorocyclopentyl)-4-fluoro-3-chloro-2,8-decadien-6-yne', // 40 
  // alcohols
  'butanol', // 41
  '2-buten-3-ol', // 42
  '3-butanol', // 43
  '1,4-butadiol', // 44
  '2-buten-1,2,4-triol', // 45
  '1,3,4-butatriol', // 46
  '2-ethylbutanol', // 47
  '2-methyl-2-buten-3-ol', // 48
  '2-bromo-3-butanol', // 49
  '2-chloro-1,4-butadiol', // 50
  '3-fluoro-2-buten-1,2,4-triol', // 51
  '2-(2-propenyl)-1,3,4-butatriol', // 52
  '2-(2-propenyl)-1,3,4-cyclohexatriol', // 53
  '5-(4-bromo-1,3,5-cyclohexenyl)-8-(1-iodo-2-cyclopropylpropyl)-3-chloro-2,8-decadien-6-yn-1,4,10-triol', // 54
  // ketones
  '2-propanone', // 55
  '2,3-butadione', // 56
  '3-buten-2-one', // 57
  '2,8-decadien-6-yn-4,5-dione', //58
  '1,3,5-cyclohexadien-1,2,3,4,5,6-hexone', // 59
  '5-(4-bromo-1,3,5-cyclohexenyl)-8-(1-iodo-2-cyclopropylpropyl)-3-chloro-6-decyn-2,4,9-trione', // 60
  '5-(2,3,4-trioxo-1,3,5-cyclohexenyl)-8-(1-iodo-2-cyclopropylpropyl)-3-chloro-6-decyn-2,4,9-trione', // 61
  // aldehydes
  'propanal', // 62
  '1,3-propanal', // 63
  '2-(2-hydroxy-cyclopropyl)-10-hydroxy-4,6,7-trioxo-2,8-decen-1-al', // 64
  '5-(3-hydroxy-1,3,5-cyclohexenyl)-10-hydroxy-4-oxo-2,6,8-decen-1-al', // 65
  '2-oxo-1,3-propanal', // 66
  '5-(3-hydroxy-1,3,5-cyclohexenyl)-4-oxo-2,6,8-decen-1,10-dial', // 67
  'cyclohexanal', // 68
  '4-bromo-2-methylcyclopentanal', // 69
  '1,3,5-cyclohexen-1-al', // 70
  // carboxylic acid
  'hexanoic acid', // 71 
  '3,5-hexadien-1-oic acid', // 72
  '2,6-heptadien-4-yne-1-oic acid', // 73
  '2,6-octadien-4-yne-1,8-dioic acid', // 74
  '5-(3-hydroxy-1,3,5-cyclohexenyl)-4-oxo-2,6,8-decen-1,10-dioic acid', // 75
  'cyclohexanoic acid', // 76
  '1,3,5-cyclohexen-2,4,6-trioic acid', // 77
  '5-(4-bromo-1,3,5-cyclohexenyl)-8-(1-iodo-2-cyclopropylpropyl)-4-hydroxy-3-chloro-2,8-decadien-6-yn-1,10-dioic acid', // 78
  // ethers
  'ethoxy ethane', // 79
  'ethoxy 2-propene', // 80
  'butoxy 1-propene', // 81
  '1-bromopropoxy ethanol', // 82
  '2-methylbutoxy 3-ethyl-2-methylbutane', // 83
  '1,2-dimethylhexoxy ethanal', // 84
  '2,4-dimethyl-3-ethylhexoxy 2-methyl-3-bromopropane', // 85
  '2-(2,4-dimethyl-3-bromo-pentyl)-3-ethylhexoxy 2-methyl-1-bromopropane', // 86
  '1-(1,3,4-trioxa-5-cyclohexenyl)butoxy%202-(3-bromo-cyclopentyl)butane', // 87
  '1,2-(1,3,4-trioxa-5-cyclohexenyl)butoxy 2-(4-oxa-3-bromo-2,5-cyclopentenyl)butane', // 88
  // esters
  'ethyl ethanoate', // 89
  'ethyl 1-propenoate', // 90
  '1-bromopropyl 1-hydroxyethanoate', // 91
  '2-methylbutyl 3-ethyl-2-methylbutanoate', // 92
  '1,2-dimethylhexyl 1-formylethanoate', // 93
  '2,4-dimethyl-3-ethylhexyl 2-methyl-1-bromopropanoate', // 94
  '2-(2,4-dimethyl-3-bromo-pentyl)-3-ethylhexyl 2-methyl-1-bromopropanoate', // 95
  '1,2-(1,3,4-trioxa-5-cyclohexenyl)butyl 2-(3-bromo-cyclopentyl)butanoate', // 96
  '1,2-(1,3,4-trioxa-5-cyclohexenyl)butyl 2-(4-oxa-3-bromo-2,5-cyclopentenyl)butanoate', // 97
  '1,2-(3,4-trioxa-1,5-cyclohexenyl)butyl 2-(4-oxa-3-bromo-2,5-cyclopentenyl)-2-butenoate', // 98
  // amines
  'propylamine', // 99
  '2-propylamine', // 100
  '1,2-propadiamine', // 101
  'N-methylethylamine', // 102
  'N-(1-bromo-hexyl)ethylamine', // 103
  'N-(1,3,5-cyclohexenyl)butylamine', // 104
  'N,N-dimethylethylamine', // 105
  'N,N-(1,3,5-cyclohexenyl)butylamine', // 106
];
