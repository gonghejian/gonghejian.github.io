class ChartRecommender {
  constructor() {
    this.bookRecommendations = {
      aries: [
        { title: '《原则》', author: '瑞·达利欧', reason: '白羊座天生具备开拓精神，这本书教会你如何在行动中建立属于自己的决策体系，将冲动转化为战略优势。' },
        { title: '《老人与海》', author: '海明威', reason: '海明威笔下那种"人可以被毁灭，但不能被打败"的硬汉精神，与白羊座永不言弃的战斗本能高度共鸣。' },
        { title: '《领导力21法则》', author: '约翰·麦克斯韦尔', reason: '白羊座天生具备领袖气质，这本书帮助你理解如何将天生的号召力转化为真正的团队影响力。' },
        { title: '《心流》', author: '米哈里·契克森米哈伊', reason: '白羊座容易因急躁而分心，这本书引导你学会在挑战中找到全神贯注的沉浸状态，释放持久能量。' },
        { title: '《孙子兵法》', author: '孙武', reason: '白羊座喜欢速战速决，而这部经典将教会你如何在冲动与谋略之间找到平衡，让行动力更具智慧。' }
      ],
      taurus: [
        { title: '《瓦尔登湖》', author: '亨利·梭罗', reason: '金牛座向往稳定与自然的和谐，梭罗在湖畔的独居生活展现了物质极简与精神丰盈的完美平衡。' },
        { title: '《美食与文明》', author: '蕾切尔·劳丹', reason: '金牛座对感官享受有着天生的敏锐，这本书从全球视角解读食物如何塑造人类文明，满足你对美味的深层思考。' },
        { title: '《穷查理宝典》', author: '查理·芒格', reason: '金牛座重视长期价值与稳健积累，芒格的多元思维模型和价值投资理念与你脚踏实地的天性不谋而合。' },
        { title: '《艺术的故事》', author: '贡布里希', reason: '金牛座对美的鉴赏力出众，这部艺术史经典将带你穿越千年，理解人类对永恒之美的追求。' },
        { title: '《当下的力量》', author: '埃克哈特·托利', reason: '金牛座容易执着于过去或固守现状，这本书帮助你学会在当下的感官体验中找到真正的安全感。' }
      ],
      gemini: [
        { title: '《苏菲的世界》', author: '乔斯坦·贾德', reason: '双子座对世界充满好奇，这部以小说形式展开的哲学史将满足你跳跃的思维和对多元知识的渴望。' },
        { title: '《思考，快与慢》', author: '丹尼尔·卡尼曼', reason: '双子座思维敏捷却容易浅尝辄止，这本书揭示人类双系统思维模式，帮助你更深入地理解自己的认知过程。' },
        { title: '《沟通的方法》', author: '脱不花', reason: '双子座是天生的沟通者，这本书提供实用的职场与社交沟通技巧，让你将语言天赋转化为真正的连接力。' },
        { title: '《银河系漫游指南》', author: '道格拉斯·亚当斯', reason: '双子座热爱幽默与奇思妙想，这部科幻经典充满荒诞与智慧，完美契合你跳跃而机智的宇宙观。' },
        { title: '《达芬奇传》', author: '沃尔特·艾萨克森', reason: '双子座拥有多元才华，达芬奇这位跨界天才的一生将激励你在不同领域之间自由穿梭，拒绝被单一标签定义。' }
      ],
      cancer: [
        { title: '《小王子》', author: '圣埃克苏佩里', reason: '巨蟹座内心柔软而深情，小王子对玫瑰的守护与对羁绊的珍视，将触动你最敏感的情感琴弦。' },
        { title: '《亲密关系》', author: '罗兰·米勒', reason: '巨蟹座将情感安全视为生命基石，这本书从心理学角度解析亲密关系的本质，帮助你建立更健康的情感连接。' },
        { title: '《追风筝的人》', author: '卡勒德·胡赛尼', reason: '巨蟹座重视忠诚与回忆，这部关于救赎与友谊的小说将深深打动你那颗怀旧而善良的心。' },
        { title: '《家》', author: '巴金', reason: '巨蟹座对家族与归属感有着天生的执念，巴金笔下那个封建家庭的悲欢离合将唤起你对"家"的深层思考。' },
        { title: '《情绪急救》', author: '盖伊·温奇', reason: '巨蟹座容易因过度敏感而受伤，这本书提供实用的情绪修复工具，帮助你温柔地照顾自己的内心。' }
      ],
      leo: [
        { title: '《成为》', author: '米歇尔·奥巴马', reason: '狮子座天生渴望发光，米歇尔从芝加哥南区到白宫的蜕变历程，将点燃你内心对自我实现的无限渴望。' },
        { title: '《演员的自我修养》', author: '斯坦尼斯拉夫斯基', reason: '狮子座拥有天生的舞台魅力，这本书不仅关乎表演，更教你如何在人生的每个场景中真诚而自信地呈现自己。' },
        { title: '《乔布斯传》', author: '沃尔特·艾萨克森', reason: '狮子座追求卓越与影响力，乔布斯那种改变世界的偏执与激情，将激励你勇敢地活出自己的传奇。' },
        { title: '《自尊的六大支柱》', author: '纳撒尼尔·布兰登', reason: '狮子座需要被认可，这本书帮助你建立内在自尊，让你明白真正的光芒不需要外界的掌声来确认。' },
        { title: '《哈姆雷特》', author: '莎士比亚', reason: '狮子座内心有着英雄主义情结，哈姆雷特关于命运与抉择的独白将唤起你对生命意义的宏大思考。' }
      ],
      virgo: [
        { title: '《清单革命》', author: '阿图·葛文德', reason: '处女座追求完美与秩序，这本书展示清单如何在复杂世界中拯救生命，让你对"细节决定成败"更有信心。' },
        { title: '《深度工作》', author: '卡尔·纽波特', reason: '处女座拥有超强的专注力与执行力，这本书提供在碎片化时代保持高效产出的系统方法，让你的天赋得到最大发挥。' },
        { title: '《断舍离》', author: '山下英子', reason: '处女座对整洁与秩序有着本能的追求，这本书不仅关乎收纳，更是一次对内心冗余的清理与净化。' },
        { title: '《黄帝内经》', author: '佚名', reason: '处女座关注健康与养生，这部中医经典将满足你对身体运行规律的探索欲，帮助你建立科学的养生体系。' },
        { title: '《福尔摩斯探案集》', author: '柯南·道尔', reason: '处女座拥有敏锐的观察力和逻辑推理能力，福尔摩斯那种从细节中洞察真相的能力将让你倍感亲切。' }
      ],
      libra: [
        { title: '《正义论》', author: '约翰·罗尔斯', reason: '天秤座天生追求公平与和谐，罗尔斯关于"无知之幕"的思想实验将深化你对正义本质的哲学思考。' },
        { title: '《美的历程》', author: '李泽厚', reason: '天秤座对审美有着独特的敏感度，李泽厚从远古到近代的美学巡礼将满足你对"美"的深层求知欲。' },
        { title: '《非暴力沟通》', author: '马歇尔·卢森堡', reason: '天秤座厌恶冲突、渴望平衡，这本书教你如何在维护关系的同时表达真实需求，实现真正的和谐沟通。' },
        { title: '《傲慢与偏见》', author: '简·奥斯汀', reason: '天秤座重视社交礼仪与情感平衡，奥斯汀笔下那种在理智与情感之间寻找最佳支点的爱情故事令你感同身受。' },
        { title: '《合作的进化》', author: '罗伯特·阿克塞尔罗德', reason: '天秤座擅长建立合作关系，这本书通过博弈论揭示"一报还一报"策略的胜利，让你对人际平衡更有信心。' }
      ],
      scorpio: [
        { title: '《百年孤独》', author: '加西亚·马尔克斯', reason: '天蝎座对人性深处的孤独与欲望有着本能的洞察，马尔克斯用魔幻之笔写尽家族命运的轮回与宿命。' },
        { title: '《乌合之众》', author: '古斯塔夫·勒庞', reason: '天蝎座善于洞察群体心理背后的暗流，这本书揭示群体行为的非理性本质，满足你对人性幽微之处的探索。' },
        { title: '《沉思录》', author: '马可·奥勒留', reason: '天蝎座拥有强大的内在力量与自省能力，这位罗马皇帝在战乱中的哲学思考将与你深沉的灵魂产生共鸣。' },
        { title: '《沉默的羔羊》', author: '托马斯·哈里斯', reason: '天蝎座对悬疑与心理暗战有着天然的兴趣，这部惊悚经典中那种智力与意志的较量将让你欲罢不能。' },
        { title: '《性、谋杀及生命的意义》', author: '道格拉斯·肯里克', reason: '天蝎座对生与死、欲望与权力有着深刻的思考，这本书从进化心理学角度揭示人类行为背后的深层动机。' }
      ],
      sagittarius: [
        { title: '《在路上》', author: '杰克·凯鲁亚克', reason: '射手座渴望自由与远方，凯鲁亚克笔下那种横穿美国的狂野旅程将点燃你心中永不熄灭的流浪之火。' },
        { title: '《人类简史》', author: '尤瓦尔·赫拉利', reason: '射手座拥有宏大的世界观，赫拉利从认知革命到人工智能的壮阔叙事将满足你对人类命运的好奇。' },
        { title: '《禅与摩托车维修艺术》', author: '罗伯特·波西格', reason: '射手座在旅途中寻找真理，这本书将一次横跨美国的摩托之旅与东方哲学思考完美融合，契合你的探索精神。' },
        { title: '《活出生命的意义》', author: '维克多·弗兰克尔', reason: '射手座追问存在的意义，弗兰克尔在集中营中发现"意义疗法"的经历将深深震撼你那颗追求真理的心。' },
        { title: '《鲁滨逊漂流记》', author: '丹尼尔·笛福', reason: '射手座热爱冒险与独立，鲁滨逊在荒岛上的生存智慧将激励你在任何未知领域都能乐观开拓。' }
      ],
      capricorn: [
        { title: '《从优秀到卓越》', author: '吉姆·柯林斯', reason: '摩羯座天生具备攀登高峰的毅力，柯林斯对11家卓越企业的研究将为你提供实现长期目标的系统路径。' },
        { title: '《曾国藩传》', author: '张宏杰', reason: '摩羯座信奉勤能补拙、厚积薄发，曾国藩从笨人到圣人的逆袭之路将是你最好的精神楷模。' },
        { title: '《思考致富》', author: '拿破仑·希尔', reason: '摩羯座对成功有着清晰的规划，希尔对500位成功人士的研究总结将帮助你建立更强大的目标实现信念。' },
        { title: '《万历十五年》', author: '黄仁宇', reason: '摩羯座具备历史眼光与结构思维，黄仁宇对明朝衰落的宏观剖析将满足你对大历史规律的探索欲。' },
        { title: '《自控力》', author: '凯利·麦格尼格尔', reason: '摩羯座以自律著称，这本书从神经科学角度揭示意志力的运作机制，帮助你更科学地管理自己的坚持。' }
      ],
      aquarius: [
        { title: '《未来简史》', author: '尤瓦尔·赫拉利', reason: '水瓶座天生关注人类未来，赫拉利对人工智能与生物技术时代的预言将激发你对未来社会的超前思考。' },
        { title: '《1984》', author: '乔治·奥威尔', reason: '水瓶座珍视自由与独立思考，奥威尔对极权社会的警示将唤起你对个体尊严与思想自由的深层捍卫。' },
        { title: '《结构洞》', author: '罗纳德·博特', reason: '水瓶座擅长在社交网络中发现创新机会，这本书揭示社会网络中的结构优势，帮助你理解自己为何总能与众不同。' },
        { title: '《爱因斯坦传》', author: '沃尔特·艾萨克森', reason: '水瓶座拥有颠覆常规的创造力，爱因斯坦用想象力颠覆物理学的故事将激励你勇敢地挑战传统智慧。' },
        { title: '《乌托拜》', author: '托马斯·莫尔', reason: '水瓶座对人类社会的理想形态充满想象，这部乌托邦开山之作将满足你对更美好社会制度的永恒追问。' }
      ],
      pisces: [
        { title: '《海子的诗》', author: '海子', reason: '双鱼座拥有诗人般的敏感灵魂，海子"面朝大海，春暖花开"的纯粹与忧伤将深深触动你内心的柔软角落。' },
        { title: '《解忧杂货店》', author: '东野圭吾', reason: '双鱼座天生具备共情与治愈他人的能力，这家能穿越时空的杂货店将唤起你对命运交织与善意传递的信仰。' },
        { title: '《当下的觉醒》', author: '埃克哈特·托利', reason: '双鱼座容易在梦境与现实之间游离，这本书引导你在当下找到心灵的锚点，将灵性天赋转化为内在力量。' },
        { title: '《安徒生童话》', author: '安徒生', reason: '双鱼座内心永远住着一个相信魔法的孩子，安徒生那些关于爱与牺牲的故事将唤醒你最初的纯真与善良。' },
        { title: '《水知道答案》', author: '江本胜', reason: '双鱼座对宇宙的神秘力量有着天然的感应，这本书关于水结晶与意念关系的探索将印证你对万物有灵的直觉。' }
      ]
    };

    this.movieRecommendations = {
      aries: [
        { title: '《勇敢的心》', originalTitle: 'Braveheart', director: '梅尔·吉布森', year: 1995, reason: '威廉·华莱士为自由而战的呐喊将点燃白羊座内心永不熄灭的战斗之火，激励你为自己的信念冲锋陷阵。' },
        { title: '《洛奇》', originalTitle: 'Rocky', director: '约翰·G·艾维尔森', year: 1976, reason: '这部关于底层拳手逆袭的经典完美诠释了白羊座"明知不可为而为之"的勇气与不服输的硬汉精神。' },
        { title: '《疯狂的麦克斯：狂暴之路》', originalTitle: 'Mad Max: Fury Road', director: '乔治·米勒', year: 2015, reason: '影片中超燃的追车场面与末日求生节奏，完美匹配白羊座对速度与冒险的原始渴望。' },
        { title: '《社交网络》', originalTitle: 'The Social Network', director: '大卫·芬奇', year: 2010, reason: '扎克伯格雷厉风行的创业故事展现了白羊座将想法迅速转化为行动的执行力，以及竞争中的锋芒毕露。' }
      ],
      taurus: [
        { title: '《小森林》', originalTitle: 'リトル・フォレスト', director: '森淳一', year: 2014, reason: '影片中对四季食材的细腻呈现与乡村生活的静谧节奏，将深深抚慰金牛座对安稳与感官享受的深层需求。' },
        { title: '《布达佩斯大饭店》', originalTitle: 'The Grand Budapest Hotel', director: '韦斯·安德森', year: 2014, reason: '韦斯·安德森对称而精致的美学风格，以及对旧日优雅时代的怀旧，与金牛座对美的执着和对传统的珍视高度契合。' },
        { title: '《美食、祈祷和恋爱》', originalTitle: 'Eat Pray Love', director: '瑞恩·墨菲', year: 2010, reason: '女主角在意大利寻找美食、在印度寻找信仰、在巴厘岛寻找平衡的旅程，正是金牛座追求感官与心灵双重满足的完美写照。' },
        { title: '《绿皮书》', originalTitle: 'Green Book', director: '彼得·法雷里', year: 2018, reason: '影片中那种在陌生环境中建立信任与友谊的缓慢过程，以及最终沉淀下来的深厚情谊，令重视稳定关系的金牛座倍感温暖。' }
      ],
      gemini: [
        { title: '《盗梦空间》', originalTitle: 'Inception', director: '克里斯托弗·诺兰', year: 2010, reason: '多层梦境的嵌套结构与开放式结局将满足双子座对复杂叙事和智力挑战的无限热情，每一次重看都有新发现。' },
        { title: '《社交网络》', originalTitle: 'The Social Network', director: '大卫·芬奇', year: 2010, reason: '影片快速剪辑的对话节奏与信息密度，完美匹配双子座敏捷的思维和对社交关系网络的本能洞察。' },
        { title: '《天使爱美丽》', originalTitle: 'Le Fabuleux Destin d\'Amélie Poulain', director: '让-皮埃尔·热内', year: 2001, reason: '爱美丽古灵精怪的想象力和对日常生活中微小奇迹的发现，将唤起双子座内心那个永远好奇、永远 playful 的孩子。' },
        { title: '《致命魔术》', originalTitle: 'The Prestige', director: '克里斯托弗·诺兰', year: 2006, reason: '双胞胎、替身、身份互换的迷局将让热爱解谜与反转的双子座沉浸其中，体验智力被挑战的快感。' }
      ],
      cancer: [
        { title: '《海街日记》', originalTitle: '海街diary', director: '是枝裕和', year: 2015, reason: '是枝裕和镜头下四姐妹在镰仓老宅中的日常点滴，那种对家族羁绊与时光流逝的温柔注视将深深打动巨蟹座的心。' },
        { title: '《美丽人生》', originalTitle: 'La vita è bella', director: '罗伯托·贝尼尼', year: 1997, reason: '父亲用想象力和爱为儿子构筑的集中营保护罩，展现了巨蟹座那种为家人牺牲一切、将痛苦独自吞咽的深沉父爱。' },
        { title: '《请以你的名字呼唤我》', originalTitle: 'Call Me by Your Name', director: '卢卡·瓜达尼诺', year: 2017, reason: '那个意大利夏天的初恋故事充满了感官细节与怀旧情绪，将唤起巨蟹座对逝去美好时光最敏感的回忆与感伤。' },
        { title: '《寻梦环游记》', originalTitle: 'Coco', director: '李·昂克里奇', year: 2017, reason: '影片对家族记忆、祖先崇拜与亲情羁绊的深情诠释，将击中巨蟹座心中那根最柔软的、关于"家"的琴弦。' }
      ],
      leo: [
        { title: '《马戏之王》', originalTitle: 'The Greatest Showman', director: '迈克尔·格雷西', year: 2017, reason: '巴纳姆从底层到娱乐大亨的华丽逆袭，以及影片中绚烂的歌舞场面，将满足狮子座对舞台、掌声与传奇人生的渴望。' },
        { title: '《国王的演讲》', originalTitle: 'The King\'s Speech', director: '汤姆·霍珀', year: 2010, reason: '乔治六世克服口吃、在二战前发表鼓舞人心演讲的故事，展现了狮子座在压力下绽放王者光芒的动人时刻。' },
        { title: '《爆裂鼓手》', originalTitle: 'Whiplash', director: '达米恩·查泽雷', year: 2014, reason: '安德鲁为成为顶级鼓手不惜一切的偏执与激情，正是狮子座追求卓越、渴望被世界看见的内心写照。' },
        { title: '《至暗时刻》', originalTitle: 'Darkest Hour', director: '乔·赖特', year: 2017, reason: '丘吉尔在二战最黑暗时刻挺身而出的领导力与演讲魅力，将激发狮子座内心那个渴望在关键时刻力挽狂澜的英雄。' }
      ],
      virgo: [
        { title: '《模仿游戏》', originalTitle: 'The Imitation Game', director: '莫滕·泰杜姆', year: 2014, reason: '图灵用逻辑与专注破解恩尼格玛密码的故事，将让注重细节与分析能力的处女座深感共鸣与敬佩。' },
        { title: '《料理鼠王》', originalTitle: 'Ratatouille', director: '布拉德·伯德', year: 2007, reason: '小米对烹饪技艺的精益求精和对食材搭配的极致追求，正是处女座在任何领域都追求完美的生动写照。' },
        { title: '《社交网络》', originalTitle: 'The Social Network', director: '大卫·芬奇', year: 2010, reason: '扎克伯格对代码的偏执与对产品细节的苛求，展现了处女座将完美主义转化为改变世界力量的可能性。' },
        { title: '《穿普拉达的女王》', originalTitle: 'The Devil Wears Prada', director: '大卫·弗兰科尔', year: 2006, reason: '安迪从职场菜鸟到精英助理的蜕变过程中展现出的高效执行力和对细节的掌控，将让处女座倍感亲切。' }
      ],
      libra: [
        { title: '《爱在黎明破晓前》', originalTitle: 'Before Sunrise', director: '理查德·林克莱特', year: 1995, reason: '维也纳街头一整夜的对话与漫步，展现了天秤座最向往的那种势均力敌、充满智性交流的理想爱情。' },
        { title: '《布达佩斯大饭店》', originalTitle: 'The Grand Budapest Hotel', director: '韦斯·安德森', year: 2014, reason: '影片对称和谐的构图、优雅复古的色调以及对旧日礼仪的致敬，将满足天秤座对平衡之美与社交优雅的极致追求。' },
        { title: '《十二怒汉》', originalTitle: '12 Angry Men', director: '西德尼·吕美特', year: 1957, reason: '陪审团密室中理性与偏见的博弈、对公正真相的执着追问，正是天秤座内心对公平正义最纯粹的渴望。' },
        { title: '《花样年华》', originalTitle: 'In the Mood for Love', director: '王家卫', year: 2000, reason: '影片中那种克制而优雅的情感、对社交边界的尊重以及美学上的精致平衡，将深深吸引注重分寸感的天秤座。' }
      ],
      scorpio: [
        { title: '《消失的爱人》', originalTitle: 'Gone Girl', director: '大卫·芬奇', year: 2014, reason: '婚姻中精心策划的复仇与心理博弈，那种暗流涌动的危险关系将让天蝎座感受到智力与情感的双重刺激。' },
        { title: '《黑天鹅》', originalTitle: 'Black Swan', director: '达伦·阿伦诺夫斯基', year: 2010, reason: '妮娜在完美追求中逐渐走向黑暗分裂的过程，展现了天蝎座对极致、转化与自我毁灭式重生的深层理解。' },
        { title: '《七宗罪》', originalTitle: 'Se7en', director: '大卫·芬奇', year: 1995, reason: '影片对人性阴暗面的冷峻剖析与令人窒息的悬疑氛围，将满足天蝎座对真相背后更深层真相的执着追问。' },
        { title: '《禁闭岛》', originalTitle: 'Shutter Island', director: '马丁·斯科塞斯', year: 2010, reason: '层层反转的心理迷局中，真相与幻觉的边界逐渐模糊，这种对人性深渊的探索将让天蝎座沉浸其中。' }
      ],
      sagittarius: [
        { title: '《荒野生存》', originalTitle: 'Into the Wild', director: '西恩·潘', year: 2007, reason: '克里斯托弗抛弃一切走向阿拉斯加荒野的旅程，是射手座对自由、冒险与真理不懈追求的极致写照。' },
        { title: '《少年派的奇幻漂流》', originalTitle: 'Life of Pi', director: '李安', year: 2012, reason: '派在太平洋上与老虎共处的227天，是一场关于信仰、生存与意义的宏大冒险，将唤起射手座对未知世界的哲学思考。' },
        { title: '《午夜巴黎》', originalTitle: 'Midnight in Paris', director: '伍迪·艾伦', year: 2011, reason: '吉尔在巴黎午夜穿越到黄金时代的奇遇，满足了射手座对不同时空、不同文化的浪漫想象与探索欲。' },
        { title: '《海上钢琴师》', originalTitle: 'La leggenda del pianista sull\'oceano', director: '朱塞佩·托纳多雷', year: 1998, reason: '1900一生不下船的选择是对无限世界的一种独特回应，将引发射手座对自由与归属、探索与安定的深层思考。' }
      ],
      capricorn: [
        { title: '《当幸福来敲门》', originalTitle: 'The Pursuit of Happyness', director: '加布里尔·穆奇诺', year: 2006, reason: '克里斯·加德纳从无家可归到成为股票经纪人的真实故事，是摩羯座相信勤奋、坚持与长期规划终将获得回报的最佳证明。' },
        { title: '《社交网络》', originalTitle: 'The Social Network', director: '大卫·芬奇', year: 2010, reason: '扎克伯格在宿舍中起步、一步步建立商业帝国的历程，展现了摩羯座将野心转化为现实成就的冷酷执行力。' },
        { title: '《至暗时刻》', originalTitle: 'Darkest Hour', director: '乔·赖特', year: 2017, reason: '丘吉尔在巨大压力下承担历史责任、做出艰难抉择的时刻，将激发摩羯座内心对领导力与历史使命的认同。' },
        { title: '《爆裂鼓手》', originalTitle: 'Whiplash', director: '达米恩·查泽雷', year: 2014, reason: '安德鲁为达到卓越不惜忍受极端训练的执着，正是摩羯座相信"没有痛苦就没有收获"的人生信条。' }
      ],
      aquarius: [
        { title: '《她》', originalTitle: 'Her', director: '斯派克·琼斯', year: 2013, reason: '人与人工智能之间的爱情寓言，探讨了未来社会中情感连接的新可能，将激发水瓶座对科技与人文边界的超前思考。' },
        { title: '《黑客帝国》', originalTitle: 'The Matrix', director: '沃卓斯基姐妹', year: 1999, reason: '尼奥觉醒后看到世界真相的隐喻，将深深共鸣水瓶座那种不愿被常规束缚、渴望打破系统规则的叛逆精神。' },
        { title: '《星际穿越》', originalTitle: 'Interstellar', director: '克里斯托弗·诺兰', year: 2014, reason: '影片对五维空间、时间相对论与人类未来命运的宏大构想，将满足水瓶座对宇宙奥秘与科学前沿的无限好奇。' },
        { title: '《大空头》', originalTitle: 'The Big Short', director: '亚当·麦凯', year: 2015, reason: '几位投资鬼才提前洞察金融危机并敢于与市场对抗的故事，展现了水瓶座独立思考、不随波逐流的独特智慧。' }
      ],
      pisces: [
        { title: '《大鱼》', originalTitle: 'Big Fish', director: '蒂姆·波顿', year: 2003, reason: '父亲用一生编织的奇幻故事与现实之间的模糊边界，将深深触动双鱼座那颗相信魔法、活在梦境与现实之间的心。' },
        { title: '《千与千寻》', originalTitle: '千と千尋の神隠し', director: '宫崎骏', year: 2001, reason: '千寻在神灵世界中的成长与迷失，以及影片中流淌的东方灵性美学，将唤起双鱼座对神秘世界的天然亲近感。' },
        { title: '《海上钢琴师》', originalTitle: 'La leggenda del pianista sull\'oceano', director: '朱塞佩·托纳多雷', year: 1998, reason: '1900用钢琴与大海对话的一生充满了诗意与孤独，那种拒绝上岸、活在自我世界中的选择令双鱼座深深理解。' },
        { title: '《天使爱美丽》', originalTitle: 'Le Fabuleux Destin d\'Amélie Poulain', director: '让-皮埃尔·热内', year: 2001, reason: '爱美丽用善意和想象改变周围人生活的童话般故事，将唤醒双鱼座内心那个永远相信爱与奇迹的浪漫灵魂。' }
      ]
    };

    this.crystalRecommendations = {
      aries: {
        primary: { name: '红玛瑙', description: '红玛瑙的炽热能量与白羊座的火象特质共振，能够稳定急躁情绪，将冲动转化为持久的行动力与勇气。' },
        secondary: { name: '红宝石', description: '红宝石被誉为"宝石之王"，能够增强白羊座的领导力与自信，同时提醒你在冲锋时也要保护好自己的心。' }
      },
      taurus: {
        primary: { name: '祖母绿', description: '祖母绿是维纳斯之石，其深邃的绿色频率能够打开金牛座的心轮，在物质追求与情感丰盈之间找到平衡。' },
        secondary: { name: '粉晶', description: '粉晶温柔的爱的能量能够软化金牛座偶尔的固执，帮助你学会在关系中柔软地给予与接受。' }
      },
      gemini: {
        primary: { name: '黄水晶', description: '黄水晶明亮的能量能够集中双子座分散的注意力，将多元思维聚焦为清晰的表达与决策。' },
        secondary: { name: '蓝纹玛瑙', description: '蓝纹玛瑙的沟通能力与双子座的表达天赋相辅相成，帮助你在交流中传递更深层的理解与同理心。' }
      },
      cancer: {
        primary: { name: '月光石', description: '月光石与月亮有着神秘的连接，能够安抚巨蟹座敏感波动的情绪，增强直觉力与内在的阴性能量。' },
        secondary: { name: '珍珠', description: '珍珠在贝壳的庇护下缓缓形成，象征着巨蟹座那种在保护中孕育美丽的能力，带来情感的平和与滋养。' }
      },
      leo: {
        primary: { name: '太阳石', description: '太阳石闪耀着金色的光芒，与狮子座的守护星太阳共振，能够放大你天生的魅力、创造力与慷慨之心。' },
        secondary: { name: '虎眼石', description: '虎眼石的金色条纹如同狮子的眼眸，能够增强狮子座的决断力与目标感，让你在发光时也能脚踏实地。' }
      },
      virgo: {
        primary: { name: '橄榄石', description: '橄榄石清新的绿色能够帮助处女座释放过度批判的自我压力，学会在追求完美时也接纳自己的不完美。' },
        secondary: { name: '蓝宝石', description: '蓝宝石的冷静频率能够平衡处女座容易焦虑的神经系统，带来清晰的思维与宁静的内心秩序。' }
      },
      libra: {
        primary: { name: '蛋白石', description: '蛋白石变幻莫测的色彩如同天秤座追求的多维和谐，能够增强你的审美感知力与社交中的优雅魅力。' },
        secondary: { name: '青金石', description: '青金石深邃的蓝色点缀着金色星点，象征着天秤座对真理与公正的追求，帮助你在抉择时倾听内在的智慧。' }
      },
      scorpio: {
        primary: { name: '黑曜石', description: '黑曜石是强大的保护石，能够帮助天蝎座在面对深层情绪与阴影时保持 grounded，将转化之力导向自我疗愈。' },
        secondary: { name: '石榴石', description: '石榴石深红的能量能够唤醒天蝎座的生命力与激情，在经历蜕变与重生时给予你扎根大地的力量。' }
      },
      sagittarius: {
        primary: { name: '绿松石', description: '绿松石是古老的旅行守护石，能够保护射手座在物理与精神的探索之旅中平安，同时增强你的沟通与表达能力。' },
        secondary: { name: '紫水晶', description: '紫水晶的高频振动能够帮助射手座在追寻真理的过程中连接更高的智慧，将广阔的视野转化为灵性的洞察。' }
      },
      capricorn: {
        primary: { name: '黑玛瑙', description: '黑玛瑙沉稳的接地能量能够帮助摩羯座在攀登高峰时保持稳定，将责任感转化为可持续的成就与内在力量。' },
        secondary: { name: '石榴石', description: '石榴石能够点燃摩羯座内心深处的热情，提醒你在追求世俗成功的同时，也不要忘记滋养自己的情感世界。' }
      },
      aquarius: {
        primary: { name: '紫水晶', description: '紫水晶是灵性觉醒之石，能够帮助水瓶座连接更高维度的灵感，将前卫的思想转化为有益于人类集体的创新。' },
        secondary: { name: '拉长石', description: '拉长石神秘的蓝光效应象征着水瓶座的前瞻视野，能够保护你在打破常规时免受负面能量的干扰。' }
      },
      pisces: {
        primary: { name: '海蓝宝', description: '海蓝宝如同海洋的化身，能够安抚双鱼座敏感的心灵，增强你在情感波涛中保持清晰与平静的能力。' },
        secondary: { name: '紫水晶', description: '紫水晶的灵性能量能够帮助双鱼座区分直觉与幻想，将天生的通灵能力转化为有意识的灵性成长工具。' }
      }
    };

    this.colorRecommendations = {
      aries: {
        lucky: { name: '正红色', description: '正红色是白羊座的本命色彩，象征着原始生命力、勇气与行动力，穿戴红色能让你在挑战面前更加无所畏惧。' },
        daily: { name: '亮橙色', description: '亮橙色比红色更活泼，适合日常穿搭，能够激发白羊座的创造力与社交热情，同时缓和过于直接的锋芒。' }
      },
      taurus: {
        lucky: { name: '翡翠绿', description: '翡翠绿是大地的颜色，与金牛座的土象本质共振，能够带来财富、稳定与丰盛感，增强你对美好事物的吸引力。' },
        daily: { name: '裸粉色', description: '裸粉色温柔而优雅，适合金牛座日常展现亲和的一面，在坚持原则的同时也能传递温暖与包容。' }
      },
      gemini: {
        lucky: { name: '明黄色', description: '明黄色如同阳光般明亮多变，能够激活双子座的思维敏捷度与好奇心，让你在人群中成为信息的焦点。' },
        daily: { name: '天空蓝', description: '天空蓝轻盈而开放，能够帮助双子座在信息过载时保持头脑清晰，在沟通中传递信任与理性。' }
      },
      cancer: {
        lucky: { name: '银白色', description: '银白色如同月光洒在波浪上，能够增强巨蟹座的直觉力与情感敏感度，带来内在的宁静与母性的温柔力量。' },
        daily: { name: '海蓝色', description: '海蓝色深邃而包容，能够帮助巨蟹座在日常中建立情感边界，在照顾他人的同时也守护自己的情绪空间。' }
      },
      leo: {
        lucky: { name: '金黄色', description: '金黄色是太阳的颜色，也是狮子座的王者之色，能够放大你的自信、创造力与领导气场，让你在任何场合都光芒四射。' },
        daily: { name: '暖橙色', description: '暖橙色比金色更亲切日常，能够展现狮子座慷慨温暖的一面，在保持尊贵感的同时拉近与他人的距离。' }
      },
      virgo: {
        lucky: { name: '森林绿', description: '森林绿代表着自然的秩序与疗愈，能够帮助处女座在追求完美时保持身心平衡，增强你的分析力与务实精神。' },
        daily: { name: '米白色', description: '米白色干净而低调，符合处女座对简洁美学的追求，能够帮助你在日常中放松对细节的过度控制。' }
      },
      libra: {
        lucky: { name: '淡粉色', description: '淡粉色是爱与和谐的颜色，能够增强天秤座的社交魅力与审美感知力，帮助你在关系中营造温柔优雅的氛围。' },
        daily: { name: '薰衣草紫', description: '薰衣草紫宁静而高贵，能够帮助天秤座在需要做决定时减少犹豫，连接内在的智慧与直觉。' }
      },
      scorpio: {
        lucky: { name: '深红色', description: '深红色如同凝固的火焰，象征着天蝎座深层的激情与转化力量，能够增强你的意志力与神秘的吸引力。' },
        daily: { name: '炭黑色', description: '炭黑色是保护色也是力量色，能够帮助天蝎座在日常中保持边界感，将强大的能量内敛而不被外界轻易消耗。' }
      },
      sagittarius: {
        lucky: { name: '宝蓝色', description: '宝蓝色是广阔天空与远方的颜色，能够激发射手座的探索欲与哲学思考，帮助你在追寻真理时保持乐观与开放。' },
        daily: { name: '紫色', description: '紫色融合了红色的热情与蓝色的冷静，能够帮助射手座在冒险与责任之间找到平衡，增强你的智慧与幽默感。' }
      },
      capricorn: {
        lucky: { name: '深棕色', description: '深棕色是大地的深沉之色，能够增强摩羯座的稳重感与权威感，帮助你在追求长期目标时保持耐心与坚韧。' },
        daily: { name: '深灰色', description: '深灰色专业而内敛，符合摩羯座低调务实的风格，能够帮助你在日常中减少不必要的能量消耗，专注于真正重要的事。' }
      },
      aquarius: {
        lucky: { name: '电光蓝', description: '电光蓝是未来与科技的颜色，能够激发水瓶座的创新思维与前卫视野，帮助你在人群中展现独特的个性与洞见。' },
        daily: { name: '青绿色', description: '青绿色介于蓝与绿之间，象征着理性与感性的融合，能够帮助水瓶座在坚持独立的同时也能与他人建立真诚的连接。' }
      },
      pisces: {
        lucky: { name: '海绿色', description: '海绿色是海洋深处的神秘之色，能够增强双鱼座的直觉力与灵性连接，帮助你在梦境与现实之间自由穿梭。' },
        daily: { name: '淡紫色', description: '淡紫色温柔而梦幻，能够帮助双鱼座在日常中保持内心的诗意与敏感，同时避免过度沉溺于情绪的漩涡。' }
      }
    };

    this.materialRecommendations = {
      aries: { material: '精钢', description: '精钢坚硬、耐用且富有现代感，能够承载白羊座的行动力与冒险精神，同时提醒你在坚硬的外表下也要保护柔软的内心。' },
      taurus: { material: '纯银', description: '纯银温润而有质感，与金牛座对品质的追求相得益彰，其天然的抗菌特性也象征着你对纯净与健康的重视。' },
      gemini: { material: '合金', description: '合金融合了多种金属的特性，轻盈而多变，正如双子座多元而灵活的个性，能够帮助你在不同角色间自如切换。' },
      cancer: { material: '珍珠母贝', description: '珍珠母贝在贝壳的保护下孕育出彩虹般的光泽，象征着巨蟹座温柔的母性力量与在庇护中创造美的天赋。' },
      leo: { material: '黄金', description: '黄金自古以来就是权力与荣耀的象征，其永不褪色的光芒与狮子座天生的王者气质完美契合，彰显你的尊贵与慷慨。' },
      virgo: { material: '铂金', description: '铂金稀有、纯净且永不褪色，其低调而持久的品质符合处女座对完美与实用的双重追求，象征着经得起时间考验的价值。' },
      libra: { material: '玫瑰金', description: '玫瑰金融合了黄金的华贵与铜的温柔，其平衡的色调正是天秤座追求和谐美学的最佳体现，优雅而不张扬。' },
      scorpio: { material: '黑钛', description: '黑钛神秘、坚韧且不易腐蚀，能够承载天蝎座深层的情感强度与转化力量，象征着在黑暗中淬炼出的不朽意志。' },
      sagittarius: { material: '黄铜', description: '黄铜温暖而充满复古冒险气息，其随着时间氧化而产生的独特包浆，象征着射手座在旅程中积累的丰富阅历与智慧。' },
      capricorn: { material: '钨金', description: '钨金是自然界最坚硬的金属之一，其沉稳的色泽与极高的耐磨性，正是摩羯座坚韧不拔、经得起时间考验的人格写照。' },
      aquarius: { material: '钛金属', description: '钛金属轻盈、坚固且充满未来感，其广泛应用于航天科技的特性与水瓶座前瞻、创新的精神高度共鸣。' },
      pisces: { material: '纯铜', description: '纯铜具有良好的能量传导性，在古代被视为连接物质与灵性世界的桥梁，能够帮助双鱼座增强直觉并稳定敏感的能量场。' }
    };
  }

  generateRecommendations(chartData) {
    const { sunSign, moonSign, ascendantSign } = chartData;
    const signs = [sunSign, moonSign, ascendantSign].filter(Boolean);

    if (signs.length === 0) {
      throw new Error('请提供至少一个星座信息（太阳星座、月亮星座或上升星座）');
    }

    const primarySign = sunSign || moonSign || ascendantSign;
    const secondarySign = moonSign && moonSign !== primarySign ? moonSign : ascendantSign;
    const tertiarySign = ascendantSign && ascendantSign !== primarySign && ascendantSign !== secondarySign ? ascendantSign : null;

    const books = this._getUniqueRecommendations(this.bookRecommendations, signs, 5);
    const movies = this._getUniqueRecommendations(this.movieRecommendations, signs, 5);

    const crystals = {
      primary: this.crystalRecommendations[primarySign].primary,
      secondary: secondarySign ? this.crystalRecommendations[secondarySign].secondary : this.crystalRecommendations[primarySign].secondary
    };

    const colors = {
      lucky: this.colorRecommendations[primarySign].lucky,
      daily: secondarySign ? this.colorRecommendations[secondarySign].daily : this.colorRecommendations[primarySign].daily
    };

    const material = this.materialRecommendations[primarySign];

    const summary = this._generateSummary(primarySign, secondarySign, tertiarySign, books, movies, crystals, colors, material);

    return {
      books,
      movies,
      crystals,
      colors,
      material,
      summary
    };
  }

  _getUniqueRecommendations(recommendationMap, signs, maxCount) {
    const seen = new Set();
    const results = [];

    for (const sign of signs) {
      if (!recommendationMap[sign]) continue;
      for (const item of recommendationMap[sign]) {
        const key = item.title || item.name;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(item);
          if (results.length >= maxCount) return results;
        }
      }
    }

    return results;
  }

  _generateSummary(primarySign, secondarySign, tertiarySign, books, movies, crystals, colors, material) {
    const signNames = {
      aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座',
      leo: '狮子座', virgo: '处女座', libra: '天秤座', scorpio: '天蝎座',
      sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座'
    };

    const primaryName = signNames[primarySign] || primarySign;
    const secondaryName = secondarySign ? signNames[secondarySign] : null;
    const tertiaryName = tertiarySign ? signNames[tertiarySign] : null;

    let summary = `你的星盘以${primaryName}为核心能量`;

    if (secondaryName) {
      summary += `，${secondaryName}为你的情感世界增添深度`;
    }
    if (tertiaryName) {
      summary += `，而${tertiaryName}则塑造了你给世界的第一印象`;
    }

    summary += `。在书影音的世界里，`;

    if (books.length > 0) {
      summary += `《${books[0].title.replace(/[《》]/g, '')}》`;
      if (books.length > 1) {
        summary += `与《${books[1].title.replace(/[《》]/g, '')}》`;
      }
      summary += `将引领你探索内在的智慧与力量；`;
    }

    if (movies.length > 0) {
      summary += `而电影《${movies[0].title.replace(/[《》]/g, '')}》`;
      if (movies.length > 1) {
        summary += `和《${movies[1].title.replace(/[《》]/g, '')}》`;
      }
      summary += `则会在光影中映照出你灵魂的轮廓。`;
    }

    summary += `在日常生活中，${crystals.primary.name}是你最核心的能量守护石，${colors.lucky.name}能为你带来幸运与自信，而${material.material}材质则能稳定并放大你独特的星盘能量。愿这些推荐成为你认识自我、拥抱命运的温柔指引。`;

    return summary;
  }
}

module.exports = { ChartRecommender };
