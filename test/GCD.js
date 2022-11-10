const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const GCD = artifacts.require("./GCD.sol");

// implementação original: https://gist.github.com/iamlockon/2b84cf7cbe01dc096df5efbd884409e7
function egcd(a, b) {
  if (a.lt(b)) [a, b] = [b, a];
  let s = web3.utils.toBN("0"), old_s = web3.utils.toBN("1");
  let t = web3.utils.toBN("1"), old_t = web3.utils.toBN("0");
  let r = web3.utils.toBN(b), old_r = web3.utils.toBN(a);
  while (r != 0) {
    let q = web3.utils.toBN(Math.floor(old_r / r));
    [r, old_r] = [old_r - q * r, r];
    [s, old_s] = [old_s - q * s, s];
    [t, old_t] = [old_t - q * t, t];
  }
  return { gcd: old_r, x: old_s, y: old_t };
}
const cenarios = [
  // simple scenarios
  { a: "35", b: "15" },
  { a: "86", b: "49" },
  { a: "45", b: "18" },
  { a: "7982", b: "557" },


  // worst scenarios (consecutive fibonacci numbers) and gcd is always 1
  { a: "354224848179261915075", b: "218922995834555169026" },
  { a: "280571172992510140037611932413038677189525", b: "173402521172797813159685037284371942044301" },
  { a: "7896325826131730509282738943634332893686268675876375", b: "4880197746793002076754294951020699004973287771475874" },

  // random scenarios
  { a: "19263068", b: "263068" },
  {
    "a": "916119484931",
    "b": "85243634909"
  },
  {
    "a": "416875819",
    "b": "4330"
  },
  {
    "a": "4274501086751462336107",
    "b": "1889808708597356123292"
  },
  {
    "a": "2033266494295575337122697754778328627998274687",
    "b": "3269720449545878919"
  },
  {
    "a": "27815564786773813724970542342692402578",
    "b": "3033143"
  },
  {
    "a": "13978038767427947322816327723189",
    "b": "687163719801"
  },
  {
    "a": "320487399812968722827661801997678475531",
    "b": "9894"
  },
  {
    "a": "79710321565948765005641778380082679942602",
    "b": "2008933853954524377"
  },
  {
    "a": "42563214056929451886374997600686263307",
    "b": "1085593094436355458375775998063501388"
  },
  {
    "a": "241903570216635300771100547217482013085",
    "b": "683266119061229758728187319882887"
  },
  {
    "a": "14144191342817605111697021888399311691932415",
    "b": "8016186579413389967"
  },
  {
    "a": "87508507768795389142155834",
    "b": "227026935848679"
  },
  {
    "a": "279310017792780225835368119936733994255",
    "b": "4565143194103043789974"
  },
  {
    "a": "3737351855206316094780098554523668236854757124",
    "b": "1039538626178644746681235785212569086"
  },
  {
    "a": "78858330559168985344817035873664858",
    "b": "1566132242"
  },
  {
    "a": "2459578304283539940430058987934502280932796181",
    "b": "3638138644924665985"
  },
  {
    "a": "64433341274491066908760912011616391842",
    "b": "711518983721151035151107841892500824"
  },
  {
    "a": "12712982056932204543357832160976354083716",
    "b": "9770490025896355"
  },
  {
    "a": "705021133776393790933759",
    "b": "14085065668977352692"
  },
  {
    "a": "12221592",
    "b": "18492"
  },
  {
    "a": "28632831355560206816348039334103998904175",
    "b": "12873693"
  },
  {
    "a": "135715249234368097759600075234148569771",
    "b": "284730232306773878999865895843102"
  },
  {
    "a": "3127407724350260283418033026922379",
    "b": "311787090230887778650078"
  },
  {
    "a": "3201659293736822304078",
    "b": "4558422"
  },
  {
    "a": "13699197259367961674",
    "b": "4511983"
  },
  {
    "a": "60139946154755225646836370915",
    "b": "28196479124231472629450418385"
  },
  {
    "a": "4774633897254194922885095480622636",
    "b": "32924947925954271"
  },
  {
    "a": "459310902224",
    "b": "1086529"
  },
  {
    "a": "5272632006480816307",
    "b": "4038982313628223119"
  },
  {
    "a": "1450002325582442920929534140033378221208137111",
    "b": "3638497811491428350009"
  },
  {
    "a": "4958621312611934643091147480269651",
    "b": "1717041"
  },
  {
    "a": "8486124539000601819731474979196",
    "b": "48567547121482"
  },
  {
    "a": "3398664172448665379519268116090138126094798136",
    "b": "41937627829464649976105426661"
  },
  {
    "a": "9537672043842523079389731341756",
    "b": "2841057343"
  },
  {
    "a": "9834960009056730724627401382943870784446874",
    "b": "248081107305346"
  },
  {
    "a": "4429413216950509594088126488238870582464043848",
    "b": "314709871898"
  },
  {
    "a": "7667095047956047733763205738109",
    "b": "839663030296"
  },
  {
    "a": "63394579728222864485719081206612559958764",
    "b": "1082386561081848626627999"
  },
  {
    "a": "17336047270532963241942422592646707003008280",
    "b": "1809770718007315696630130671894869"
  },
  {
    "a": "12797000068510945978830619728948520530339",
    "b": "7527424373657219766"
  },
  {
    "a": "71112361167814066",
    "b": "700275959"
  },
  {
    "a": "131133859",
    "b": "63786"
  },
  {
    "a": "29433000996239341998829186762",
    "b": "305342314565946541214348"
  },
  {
    "a": "1443504437954796636796224437817545184654663379691",
    "b": "4691737383939"
  },
  {
    "a": "92615380480362317076386076006661390367",
    "b": "34168556725161417528918347989"
  },
  {
    "a": "667891617450741941807",
    "b": "181082464415"
  },
  {
    "a": "454011572645907470405644267157611425",
    "b": "4947211982395551870925224867097257"
  },
  {
    "a": "759791988039",
    "b": "3464430562"
  },
  {
    "a": "286341724946037990210458446276354606667",
    "b": "3532454381"
  },
  {
    "a": "324821375020606973714380",
    "b": "118535502359515"
  },
  {
    "a": "5587326078200681521934098821813401121473230479",
    "b": "31376"
  },
  {
    "a": "375635219456008384749356061160568652362",
    "b": "6820048606533542844601677578524"
  },
  {
    "a": "1019518502259501200187321938985852240128514701882",
    "b": "1312338008855043046137524848668145037"
  },
  {
    "a": "470473307290663225553929554082599",
    "b": "40470263605894"
  },
  {
    "a": "91559761474151",
    "b": "34381"
  },
  {
    "a": "246978770573",
    "b": "3124460227"
  },
  {
    "a": "15481674215310080190299677536009447283442606",
    "b": "120327348665033"
  },
  {
    "a": "18224110957250805246858761351034",
    "b": "62194826310862796"
  },
  {
    "a": "36005495948296189011193284975252685333881",
    "b": "787050452226266368050211"
  },
  {
    "a": "19541420871379373734973221804",
    "b": "43377505990334611"
  },
  {
    "a": "33783122611879358169206963279906614250119",
    "b": "46071856110384"
  },
  {
    "a": "232064271172984402178103972155193023994",
    "b": "15314539432097826951"
  },
  {
    "a": "602355253150012253721385552350180481238548094946",
    "b": "74827108236658349206693486415"
  },
  {
    "a": "173003441247920707585814414371998177295",
    "b": "1032294390270001291684644441454751215"
  },
  {
    "a": "1476469409238524811273388221363",
    "b": "239907048021485"
  },
  {
    "a": "1249606005859926550941",
    "b": "9501811455751696"
  },
  {
    "a": "888373485313484690",
    "b": "136087175841561"
  },
  {
    "a": "40774081656672619942319961868198054482959",
    "b": "11469189808372373674745275"
  },
  {
    "a": "1717530083865679191820499449727354190629446",
    "b": "643556374368978348245016"
  },
  {
    "a": "44378253936333271228444424",
    "b": "426586919"
  },
  {
    "a": "901313977245288125220357413707315980823494320069",
    "b": "495501381093161626514"
  },
  {
    "a": "4551997078463592034866206246590217326803953656",
    "b": "1173598261740420135368096"
  },
  {
    "a": "9778663311236431978946271984728290558936390",
    "b": "2922447177675471511725"
  },
  {
    "a": "152706002293360427721686214826114136249262323",
    "b": "15062925708128688"
  },
  {
    "a": "3497325817570458244118493346081110",
    "b": "8365534979715813"
  },
  {
    "a": "57066",
    "b": "28180"
  },
  {
    "a": "518427528613662626868",
    "b": "14367"
  },
  {
    "a": "310810743252",
    "b": "14570825"
  },
  {
    "a": "39011944757103190",
    "b": "171412048683"
  },
  {
    "a": "2856903221646156340",
    "b": "41653632099932892"
  },
  {
    "a": "18287465871831585573041715741517441232795901",
    "b": "562281380968502910038749"
  },
  {
    "a": "4570646674572575249034611105208298",
    "b": "9081144460466"
  },
  {
    "a": "38695733032522453",
    "b": "2410415367"
  },
  {
    "a": "4675752741449953516401",
    "b": "143752316155"
  },
  {
    "a": "14694013578979477442198122701353201718276926",
    "b": "2526602795"
  },
  {
    "a": "279024128808567925053275210",
    "b": "2566293882878798570851"
  },
  {
    "a": "4536797265462870683741915976201767",
    "b": "182348714559665933659159524"
  },
  {
    "a": "1215558846800090557325749940892390180646330658130",
    "b": "21469697927381467891776606917"
  },
  {
    "a": "238048137374596668190157138915671268416",
    "b": "6366262125963491498315617310268"
  },
  {
    "a": "385189270588367809518862642616294745",
    "b": "71578365299471533780383672423716787"
  },
  {
    "a": "53966557880526418338602855174329446804244",
    "b": "58536"
  },
  {
    "a": "65075507068800260027226871550663499970566",
    "b": "1033875484304632732833"
  },
  {
    "a": "3037707268098268991707065101141847097767863532",
    "b": "1533648984873201685854"
  },
  {
    "a": "817821497023091132698561057555782",
    "b": "7837799"
  },
  {
    "a": "285732919047042717217137421998531970200110952099",
    "b": "4230609020"
  },
  {
    "a": "6608707034118334079919256706034",
    "b": "25355603675890241982739880"
  },
  {
    "a": "2052568926560221145222909048117536127358741058",
    "b": "185614222188929378299036757655001350897"
  },
  {
    "a": "235503266287980",
    "b": "1199286242"
  },
  {
    "a": "572595527583209230573816658063041248057628869",
    "b": "249337929766559023263993092"
  },
  {
    "a": "2039095109322558767966941962745246",
    "b": "772852731248792196580589645679031"
  },
  {
    "a": "4699285522542954658769174625",
    "b": "10113682889870487197"
  },
  {
    "a": "11605908477100912520729754064349",
    "b": "41956866699369293045080987588"
  },
  {
    "a": "12386385121594439162588825273249",
    "b": "10956"
  },
  {
    "a": "2136022219168508633",
    "b": "809983230773"
  },
  {
    "a": "5311313871358737221678977597387826376969500792",
    "b": "216239468312569"
  },
  {
    "a": "42153086142258020",
    "b": "46476"
  },
  {
    "a": "79064490476114986264979845687787651298652",
    "b": "2370671881063177985"
  },
  {
    "a": "745607740409012975948",
    "b": "8674019167313825899"
  },
  {
    "a": "613823704257619884556672",
    "b": "1976887764"
  },
  {
    "a": "837023373668389501821198550883355644",
    "b": "93305965885"
  },
  {
    "a": "4686185049772836858539882182531838231133207870",
    "b": "212099958425249925241778348044056307808"
  },
  {
    "a": "3467830389951407674725679999961489530753452244",
    "b": "49639558198049885231898617851776837914675"
  },
  {
    "a": "12749622681406330640730146342687815849284920619",
    "b": "2344810743054589262563"
  },
  {
    "a": "1196078484917504997005225",
    "b": "3809183970700492494"
  },
  {
    "a": "2961498617877546278825440116667197501032690257",
    "b": "39131868195569768145653787759"
  },
  {
    "a": "7842527026134396174647466014555299825578195",
    "b": "3845695681283964509638"
  },
  {
    "a": "256503799569824766420888080416899107326",
    "b": "3942074036284851745669007"
  },
  {
    "a": "201162911838447006919745979011990871650",
    "b": "69362241894312303"
  },
  {
    "a": "1129726081909143708678243654450505",
    "b": "19867170712851977132347141207"
  },
  {
    "a": "7255107987070113915840357968847404415121",
    "b": "4310278133262789269030"
  },
  {
    "a": "345191544210796737157653",
    "b": "13254594"
  },
  {
    "a": "2825267558289974377036700691613358",
    "b": "17550"
  },
  {
    "a": "634814170601364084467350",
    "b": "4075491137"
  },
  {
    "a": "1030772989064957613361340455678834872",
    "b": "670836241452648652296877152045695"
  },
  {
    "a": "297014433435781008700501320201591196551",
    "b": "1553570478002802557848551360639822"
  },
  {
    "a": "85763364828030884707715585197624247275",
    "b": "208621906375990848931610134323258787"
  },
  {
    "a": "5071166976962020696876119621798688",
    "b": "8722292390667479653"
  },
  {
    "a": "5263852918072859270541678704690342885403629",
    "b": "52503859750872580"
  },
  {
    "a": "229094476528392416208926495",
    "b": "771466744373"
  },
  {
    "a": "230459881377494376714186260171141",
    "b": "4156440"
  },
  {
    "a": "5322613516297984034833546926916",
    "b": "56962762172010294"
  },
  {
    "a": "912857933041067398612697394473701775735570019208",
    "b": "1298246609847455293272720324504977235"
  },
  {
    "a": "2473238508744381296981069118897360928101976713",
    "b": "3211847600310093785699594105209643"
  },
  {
    "a": "144058102754254948100",
    "b": "56861696899591"
  },
  {
    "a": "201446409735054198914563157646893834775",
    "b": "1236723248"
  },
  {
    "a": "16350069899938928789007753218116469124139203",
    "b": "70428308385476055527222925009345148684722"
  },
  {
    "a": "2978315509050411545435226953241902",
    "b": "55150552301400462385365624063"
  },
  {
    "a": "899755849708204152171975932362189141",
    "b": "150413203767168"
  },
  {
    "a": "241034005134935",
    "b": "56120842"
  },
  {
    "a": "2315805016290072285640685273205521",
    "b": "89510994"
  },
  {
    "a": "153535581672",
    "b": "60685"
  },
  {
    "a": "3080919618445595646564808525611572321033139178",
    "b": "3571107871050685103708"
  },
  {
    "a": "82666183624196121572873797327028290452785",
    "b": "237112215239946"
  },
  {
    "a": "1121198203540375411769837444205300431357082675994",
    "b": "754065339"
  },
  {
    "a": "39126279768485378694058844973",
    "b": "52610"
  },
  {
    "a": "8358750876143920825741391086732605094679017",
    "b": "13391140483450692662446265032859"
  },
  {
    "a": "991775762136311655820849679337669809",
    "b": "8911853350444425145"
  },
  {
    "a": "56730474493073254338656989845716401886386",
    "b": "249457755609518"
  },
  {
    "a": "231765725843895985845462",
    "b": "4506184285890895862216"
  },
  {
    "a": "2281372065355956611301",
    "b": "57370"
  },
  {
    "a": "118358",
    "b": "47743"
  },
  {
    "a": "2056112878",
    "b": "62032"
  },
  {
    "a": "1352345836650662458390602094902774",
    "b": "1463514347423167527824"
  },
  {
    "a": "5543229131954759406035076869637082302740850024",
    "b": "6278115"
  },
  {
    "a": "386927307688658007954584037005994286186629",
    "b": "311997324476689801537432148676831665039"
  },
  {
    "a": "9560993722386683560618973913578",
    "b": "120130248934943697196512538"
  },
  {
    "a": "9457914696373606834267003951780",
    "b": "3736047460870586830023"
  },
  {
    "a": "59513450322937555370778437459",
    "b": "482306956053"
  },
  {
    "a": "920294961326203810666239",
    "b": "7119589453352769350"
  },
  {
    "a": "7658404817438935061040875596389328606",
    "b": "72573837499892"
  },
  {
    "a": "71648874265764776557514340896646491484975",
    "b": "7131541"
  },
  {
    "a": "13274890888130986763022908206338188893910",
    "b": "1887243293"
  },
  {
    "a": "1391987261276585767506671887873975186861820280",
    "b": "139194247450694160232759546"
  },
  {
    "a": "75016404582735784073009217893032620086428",
    "b": "66721610975463743339104476119796623987512"
  },
  {
    "a": "87299705452685836385806047729085989966",
    "b": "20021022796764915328496446340"
  },
  {
    "a": "273224950515160709337897211",
    "b": "14067886734540901286"
  },
  {
    "a": "710342003565129995053096811676497912023946943291",
    "b": "805279469857"
  },
  {
    "a": "841755201812314959687431852255444101143127401672",
    "b": "1086591544579"
  },
  {
    "a": "2924800510645862579908995478450119481839429822",
    "b": "3332857762641026111264"
  },
  {
    "a": "201564730398961",
    "b": "15125415"
  },
  {
    "a": "726119805097700607522961736715547159210516744840",
    "b": "4811396368955575"
  },
  {
    "a": "149265232337619",
    "b": "39500"
  },
  {
    "a": "1392315250308736559238456015222453659375115723",
    "b": "57833185177380890750817253330"
  },
  {
    "a": "903467121416254853403152593589783583",
    "b": "1862802809"
  },
  {
    "a": "485453057918422006004602483956456399565582245838",
    "b": "401000872141"
  },
  {
    "a": "20667711116624852018882693502080932",
    "b": "7854633822896165003"
  },
  {
    "a": "615561449",
    "b": "42287"
  },
  {
    "a": "7666198069636044668735804860131108547736293",
    "b": "1900636105234168327612169745516"
  },
  {
    "a": "3276819771614034995198",
    "b": "3447337235321902451"
  },
  {
    "a": "2764034550631186916360147846309239",
    "b": "239773449779"
  },
  {
    "a": "996506529741376291172",
    "b": "43877469920416"
  },
  {
    "a": "5286971521760769900420289798787937052452407577",
    "b": "1843156712039913985151190091567629889928342"
  },
  {
    "a": "74548120897289435625202974661",
    "b": "31154913746548383804257892790"
  },
  {
    "a": "1285889111424257538039238001179761161",
    "b": "3768459997428468257803"
  },
  {
    "a": "3512467716074432015135860363668909",
    "b": "4144192717953833629976"
  },
  {
    "a": "56524057330888968148911839059999436769547",
    "b": "732202057"
  },
  {
    "a": "54379972966388308843149870641273944381517",
    "b": "58030139988324772116529695498"
  },
  {
    "a": "119431920218129269727531262922116895353711238037",
    "b": "4512544"
  },
  {
    "a": "221542710225256456173083971295882691586",
    "b": "10529903153176568459755370717616"
  },
  {
    "a": "627773333844160750935527335717907741851547985138",
    "b": "421033290207148396276422219813180729"
  },
  {
    "a": "3008717207428724860785",
    "b": "2578207115400639226031"
  },
  {
    "a": "15102717881305558247439134",
    "b": "11372254"
  },
  {
    "a": "362046071422223226602601240801899276777483273209",
    "b": "211165214142564"
  },
  {
    "a": "9631365792120340535703241715924379383263039",
    "b": "4683180976028333031831"
  },
  {
    "a": "966500114728411",
    "b": "7280443"
  },
  {
    "a": "69102518860583264377085775",
    "b": "33013967241842856128791116"
  },
  {
    "a": "967673",
    "b": "15873"
  },
  {
    "a": "22731583518742",
    "b": "6237"
  },
  {
    "a": "1173372322337766015750808785443900798299220538774",
    "b": "121828431395201827261"
  },
  {
    "a": "1484768598358073492264166803614",
    "b": "911186610852"
  },
  {
    "a": "298428083494548638570648216618742471007199516421",
    "b": "57095486489285517295120674418207831965477"
  },
  {
    "a": "30480297390496988209244792905973106142261",
    "b": "214054118784161044359104302"
  },
  {
    "a": "92344358594508159839130243",
    "b": "1007453738673872634700527"
  },
  {
    "a": "63430544599097841759648504711030941707203",
    "b": "11127223225402172807975096571998"
  },
  {
    "a": "1218516916880968353574149509559978091105950390",
    "b": "13054383885356620998325240271363808713871835"
  },
  {
    "a": "13849923234479129127406463869",
    "b": "14427918669699285289"
  },
  {
    "a": "184876122074372",
    "b": "7077663"
  },
  {
    "a": "124208069290095036363867499802009541172150292433",
    "b": "30735420026761598465693387458"
  },
  {
    "a": "4268972776254744521579578526976658",
    "b": "2404409860612234096184"
  },
  {
    "a": "11656121623738176129763667497955111364380378",
    "b": "1028067225940791315576221"
  },
  {
    "a": "26631076830217886636908709978",
    "b": "63710"
  },
  {
    "a": "80505655397298784309399661809780915466083",
    "b": "876366610849980655795516"
  },
  {
    "a": "8569292458207885372",
    "b": "534838466919"
  },
  {
    "a": "654287721907872706313546",
    "b": "10644240189463015218"
  },
  {
    "a": "1120477108177547975803178533975800880174216675281",
    "b": "197606903210241450731007066849848027358381064487"
  },
  {
    "a": "229457598344865722855760586946542803797",
    "b": "554861255065116284450362647252505316"
  },
  {
    "a": "11681071951676532944431974835",
    "b": "6533"
  },
  {
    "a": "953109875080022343293151430866902719429106490034",
    "b": "755004087050993287043676542238"
  },
  {
    "a": "6099500577424591782944889211991292746002",
    "b": "4037814919742085969823588418168608"
  },
  {
    "a": "11774514029272107440",
    "b": "5890341"
  },
  {
    "a": "9046081505358096658230401143581873196877976",
    "b": "3253523649369226073537226042539263254557"
  },
  {
    "a": "3738123082",
    "b": "4050121"
  },
  {
    "a": "80479287807596800769929352315728422832947",
    "b": "5327487845787489486038203194217"
  },
  {
    "a": "9989784913526308032427538526",
    "b": "228072892709581"
  },
  {
    "a": "1359855730477123024831801817714895914928332889887",
    "b": "8527979593969848504828246948806"
  },
  {
    "a": "257367867596881817096190408418042648113",
    "b": "82684326734197144183254282"
  },
  {
    "a": "874092322755267646111685128578488501",
    "b": "18429216317001167"
  },
  {
    "a": "679822295841928243347789141319909937908049354473",
    "b": "17636317089144821350"
  },
  {
    "a": "1039130298080991513165930489123151309",
    "b": "41227"
  },
  {
    "a": "5378960819578217748",
    "b": "179772056904305"
  },
  {
    "a": "7194950913051573099924620589307723771666230",
    "b": "18218625618780501243582711265"
  },
  {
    "a": "1399889123681394716814",
    "b": "6534092992753155099"
  },
  {
    "a": "469807737211251489850",
    "b": "277079159086061"
  },
  {
    "a": "7196296671598031124",
    "b": "278168212305752"
  },
  {
    "a": "18478723780185681947696276583775943085673157",
    "b": "916090995940073758370582"
  },
  {
    "a": "11961715599918401271388935683990403721331530",
    "b": "6314087282680391"
  },
  {
    "a": "249415617654916792953180547840496387",
    "b": "4051015980300582647854"
  },
  {
    "a": "288559800062548442206115151248825635575",
    "b": "140967941467377533692003651"
  },
  {
    "a": "3145630057995058040392468082013328",
    "b": "10728711008"
  },
  {
    "a": "213967038950981477967163914",
    "b": "970841292638"
  },
  {
    "a": "1409501629318187477065122375906395604933546263872",
    "b": "22987886579792"
  },
  {
    "a": "18280293476314298201",
    "b": "879341724090"
  },
  {
    "a": "35367830033591034296141924170",
    "b": "587942413772923370462"
  },
  {
    "a": "20900143980244698092300726684249870512860438",
    "b": "51111378253703192260728735625825435264005"
  },
  {
    "a": "6044514434078406439174748446720",
    "b": "4473394154963962634692"
  },
  {
    "a": "292013068547448467900697726227352244462",
    "b": "3961763921262069607243614113630828"
  },
  {
    "a": "1428022378515325044",
    "b": "352752801518"
  },
  {
    "a": "127997115190947949384723473",
    "b": "113334633384040883898133985"
  },
  {
    "a": "3697103970062927175322429948000108644109907369",
    "b": "12294440475197799267429034050973015427402"
  },
  {
    "a": "4319091064568902757734596352629493744158",
    "b": "952512319912192825514007428032008377"
  },
  {
    "a": "643581108890046963660",
    "b": "27495"
  },
  {
    "a": "18976002152577402151219750974165171496885",
    "b": "55701"
  },
  {
    "a": "10861170916242822457404425834740",
    "b": "261276232002804"
  },
  {
    "a": "10665405038805441696843814590551050863515113",
    "b": "1317434163287135012877521439316964663"
  },
  {
    "a": "1058967330219",
    "b": "37828"
  },
  {
    "a": "5875025449757601635978951128743047024669",
    "b": "20686179374974907192447328770"
  },
  {
    "a": "2852082428272471664299",
    "b": "3801004288142801"
  },
  {
    "a": "291162380474909830606893006",
    "b": "409394709506335153266"
  },
  {
    "a": "27044979794968269116709842807",
    "b": "11792605"
  },
  {
    "a": "104371899592486138647420613",
    "b": "2764950112966567232181"
  },
  {
    "a": "44748262998052033374079555916338176876912",
    "b": "65406"
  },
  {
    "a": "1267663377798394323634479368616252718026012860095",
    "b": "20037561867594444341306355275235034203730"
  },
  {
    "a": "167510276452687906519049380",
    "b": "5871"
  },
  {
    "a": "1263698400955383215105169827603256379776432955",
    "b": "9985364514637085492275963487521"
  },
  {
    "a": "17109002108923703776",
    "b": "563173020"
  },
  {
    "a": "29649466699286768687092974455188359571230",
    "b": "171879251110139081685795950"
  },
  {
    "a": "3283525773983448904069340858352245",
    "b": "1106620196132743884616247"
  },
  {
    "a": "1888762371792499430940589075869765831858464",
    "b": "31376873012073168"
  },
  {
    "a": "478374918117079811803112583069104041573059454350",
    "b": "47582868610439613"
  },
  {
    "a": "3276786832630106748053777507674707",
    "b": "53555207778292706425706474609"
  },
  {
    "a": "55245947813551823457222852054931640991627",
    "b": "10012685"
  },
  {
    "a": "9885363416311532447900365829206356594491920",
    "b": "83923192054517064653074047286100641063"
  },
  {
    "a": "1074453399123491711161249931255953960",
    "b": "713873506061119738250538"
  },
  {
    "a": "1230904700155506353529415019310127869105178879497",
    "b": "4843429921069184771543205664210131762986840"
  },
  {
    "a": "33241773480711304902939406356693109709310",
    "b": "222427120131933171857400"
  },
  {
    "a": "3272798138717136255786463625347201906748357297",
    "b": "10333737654515106543258172048320"
  },
  {
    "a": "289780318655",
    "b": "9443465"
  },
  {
    "a": "873734739247408937969927497033219895936632378102",
    "b": "16012394322363"
  },
  {
    "a": "16394115914716819703582872185691601745205827",
    "b": "615205469765888251272810317449918"
  },
  {
    "a": "51636491224800740926338269",
    "b": "4837399"
  },
  {
    "a": "5760770921000948402419113784429",
    "b": "35766025591671366459532987824"
  },
  {
    "a": "3133538688786526522145076686810868",
    "b": "3130624739134238361616242293010802"
  },
  {
    "a": "4560965019480725572048404392969",
    "b": "2735935"
  },
  {
    "a": "2172480683751727402734515602019616",
    "b": "83114076006069"
  },
  {
    "a": "1280089894469855247340240921599525703587274194123",
    "b": "5258645441627558559355460233908579784854"
  },
  {
    "a": "58419751989801361",
    "b": "43166184271066592"
  },
  {
    "a": "747943599148983125351443832277833490424934942488",
    "b": "12320301"
  },
  {
    "a": "4337341362545570281076191972882481228211",
    "b": "268862709806708973656792383449036092861"
  },
  {
    "a": "2495846196279627317",
    "b": "9958"
  },
  {
    "a": "51160506693695978224673308480228377",
    "b": "64495675028267521216847672"
  },
  {
    "a": "759650465769110027461916623280376688",
    "b": "82098440693423126071447461730022"
  },
  {
    "a": "71980175229439446187736452369",
    "b": "56510515605582538"
  },
  {
    "a": "11000944636410115472834326995802316662893",
    "b": "2060368310784669648644045414664503"
  },
  {
    "a": "181694622923971743881725611827778768",
    "b": "67359297824905"
  },
  {
    "a": "3573690565378806088145228982974626689781740761",
    "b": "4429547200703904724959"
  },
  {
    "a": "28943299724805720644065424",
    "b": "155241902067385"
  },
  {
    "a": "50852349909975964",
    "b": "537419488669"
  },
  {
    "a": "10371873853472186690149769488089063774524520",
    "b": "3040600957"
  },
  {
    "a": "1499441120973906445035482129081958015155102",
    "b": "758533185885"
  },
  {
    "a": "43046204593380002218351379862995521",
    "b": "929473519272742888097275"
  }
];

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('GCD', ([contractOwner, secondAddress, thirdAddress]) => {
  let gcd

  // this would attach the deployed smart contract and its methods 
  // to the `gcd` variable before all other tests are run
  before(async () => {
    gcd = await GCD.deployed()

  })

  // check if deployment goes smooth
  describe('validate', () => {
    // check if the message is stored on deployment as expected
    it('Euclidian Algorithm', async () => {
      for (let i = 0; i < cenarios.length; i += 1) {
        const message = await gcd.Soluciona.call(web3.utils.toBN(cenarios[i].a), web3.utils.toBN(cenarios[i].b));
        
        console.log(`Gás usado no algoritmo euclidiano para o cenário ${i}`, +message[1].toString());
        cenarios[i].gasWhenCalculateOnChain = +message[1].toString();
      }
    })
    it('Validate Extended Euclidian Algorithm', async () => {
      for (let i = 0; i < cenarios.length; i += 1) {
        // console.log(`Cenário ${i}`);
        const a = web3.utils.toBN(cenarios[i].a);
        const b = web3.utils.toBN(cenarios[i].b);

        const localCall = a.egcd(b);
        // console.log(localCall);

        const maxInt = web3.utils.toBN("2").pow(web3.utils.toBN("255"));
        // console.log("Verificando se produto estoura o max number");
        // console.log(maxInt.lt(a.mul(localCall.a)));
        // console.log(maxInt.lt(b.mul(localCall.b)));

        // const gcdDividesBothValues = (a.mod(localCall.gcd)).eq(web3.utils.toBN("0")) && b.mod(localCall.gcd).eq(web3.utils.toBN("0"))
        // const theresTwoIntegersResultsGcdInBinomium = localCall.gcd.eq(a.mul(localCall.a) + b.mul(localCall.b))
        // console.log("Verificando offchain se o resultado ta correto: ", gcdDividesBothValues && theresTwoIntegersResultsGcdInBinomium);


        const message = await gcd.Verifica.call(a, b, localCall.gcd, localCall.a, localCall.b);
        console.log(`Gás usado na verificação para o cenário ${i}`, +message[1].toString());
        cenarios[i].gasWhenValidateOnChain = +message[1].toString();

      }
      console.log(cenarios.map(x => x.gasWhenCalculateOnChain / x.gasWhenValidateOnChain));

      fs.writeFile('test.json', JSON.stringify(cenarios.map(x => x.gasWhenCalculateOnChain / x.gasWhenValidateOnChain)), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    })


  })

})