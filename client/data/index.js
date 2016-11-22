import Constants from '../constants'

export default {
  'default-route': '/home',
  'content': {
    en: {
      navigation: {
        projects: 'Projects',
        about: 'About'
      },
      preview: {
        discover: 'Discover project',
        viewMore: 'View more'
      },
      project: {
        viewInfos: 'Project info',
        closeInfos: 'Back to pictures',
        back: 'Back',
        previousImg: 'Previous image',
        nextImg: 'Next image',
        discover: 'Discover next project'
      }
    },
    fr: {
      navigation: {
        projects: 'Projets',
        about: 'À propos'
      },
      preview: {
        discover: 'Découvrir le project',
        viewMore: 'En savoir plus'
      },
      project: {
        viewInfos: 'Info',
        closeInfos: 'Photos',
        back: 'Retour',
        previousImg: 'Image précédente',
        nextImg: 'Image suivante',
        discover: 'Découvrir le projet suivant'
      }
    }
  },
  'routing': {
    '/about': {
      name: 'About',
      assets: [],
      content: {
        en: 'VOLONTIERS conçoit et réalise des évènements originaux, esthétiques et inoubliables.<br>A chaque brief, les acteurs de l\'agence se plongent dans l\'univers de la marque et de son produit pour proposer des solutions parfaitement adaptées aux attentes du client.<br>Pour créer la surprise, être différent des nombreux évènements auxquels est invité un public toujours plus blasé, qu\'il faut en permanence étonner, séduire et convaincre, VOLONTIERS est en perpétuel recherche des nouveautés et des créations liées ou non au monde de l\'évènementiel.<br>Bien qu’éphémère, nos décors ont l\'exigence de la qualité dans leur réalisation.<br>C\'est en partant de ce constat que VOLONTIERS a développé une deuxième activité en synergie avec l\'évènementiel, l\'agencement d\'espaces retail (vitrines, corners, pop up, etc).<br>Volontiers est notre réponse face à vos ambitions les plus folles.',
        fr: 'VOLONTIERS conçoit et réalise des évènements originaux, esthétiques et inoubliables.<br>A chaque brief, les acteurs de l\'agence se plongent dans l\'univers de la marque et de son produit pour proposer des solutions parfaitement adaptées aux attentes du client.<br>Pour créer la surprise, être différent des nombreux évènements auxquels est invité un public toujours plus blasé, qu\'il faut en permanence étonner, séduire et convaincre, VOLONTIERS est en perpétuel recherche des nouveautés et des créations liées ou non au monde de l\'évènementiel.<br>Bien qu’éphémère, nos décors ont l\'exigence de la qualité dans leur réalisation.<br>C\'est en partant de ce constat que VOLONTIERS a développé une deuxième activité en synergie avec l\'évènementiel, l\'agencement d\'espaces retail (vitrines, corners, pop up, etc).<br>Volontiers est notre réponse face à vos ambitions les plus folles.'
      }
    }
  },
  projects: {
    'nike-olivier-rousteing': {
      'inHome': true,
      'name': 'nike × olivier rousteing',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'To unveil collaboration between Nike and the artistic director of Balmain, Olivier Rousteing, VOLONTIERS designed and produced a show of great magnitude. To do this, we invested and transformed the main castle of the International University City of Paris to host a special celebration of the past footballing brand, before ending up in a hoisted nave in the gardens to unveil bold future the vision Nike Football.<br/>Once on site, the press, celebrities and handpicked guests could discover a collection designed by Olivier Rousteing in the dome of the gardens of the Cité Universitaire Internationale de Paris, entirely recreated by us for the occasion. When time came for the runway show, the doors opened on the lawn where was sat a dome with a 30 meter diameter. Inside, 360* mapping served as a dynamic backdrop to a show combining models and dancers whose movements were interacting  with the projected images.<br/>Then, to continue with the celebration of football on the eve of Euro 2016 as it should, we littered on top of the inner pyramid structure - built to accommodate guests - a circular dance floor and a golden Dj booth.',
        fr: 'Afin de dévoiler la collaboration entre le directeur artistique de la maison Balmain, Olivier Rousteing, et Nike, l’agence VOLONTIERS a conçu et produit un show d’une très grande envergure.<br/>Le château de la Cité Universitaire de Paris a été investi pour accueillir les nombreux invités autour d’un cocktail durant lequel ils ont pu découvrir un décor mettant en scène le passé footballistique de la marque. Les portes se sont ensuite ouvertes sur l’extérieur, dévoilant un impressionnant dôme de 30m de diamètre érigé pour l’occasion.<br/>A l’intérieur, un mapping à 360° servait de toile de fond à un show présentant la collection. Millimétré, ce show mêlait mannequins évoluant autour d’une structure pyramidale et danseurs dont les mouvements interagissaient avec les images projetées. Puis, au sommet de la pyramide, depuis un dj booth circulaire, la soirée s’est prolongée jusqu’au milieu de la nuit avec un live d’A-Chal et des sets de DJs réputés (ou : Depuis un Dj booth doré, perchés au sommet de la pyramide, A-Chal & plusieurs DJs réputés se sont produits en live jusqu’au bout de la nuit).'
      },
      preview: 'SW16043_NIKE_NSW_OR_JJ0707_PR.jpg',
      assets: [
        'SW16043_NIKE_NSW_OR_JJ0113_PR_1.jpg',
        'SW16043_NIKE_NSW_OR_JJ0718_PR.jpg',
        'SW16043_NIKE_NSW_OR_JJ1153_PR.jpg',
        'SW16043_NIKE_NSW_OR_JJ1175_PR.jpg',
        'SW16043_NIKE_NSW_OR_JJ1275_PR.jpg',
        'SW16043_NIKE_NSW_OR_RG1073_PR.jpg',
        'SW16043_NIKE_NSW_OR_RG1179_PR_1.jpg'
      ]
    },
    'airbnb-paris': {
      'inHome': true,
      'name': 'airbnb paris - la maison parisienne',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'To breathe life into the “Don’t go there, live there" AIRBNB campaign, orchestrated by the AKQA Paris agency, which purpose was to urge tourists to take possession of the cities they visited as locals would, VOLONTIERS took up residency in an Airbnb house and imagined many workshops to pace said house during 4 days.<br/>In Paris, a magnificent home was redecorated for the occasion, each room offering its audience an immersive and authentic experience of Parisian local life through different thematic such as music, culture, gastronomy and sports.',
        fr: 'Pour donner vie à la campagne AIRBNB « Don’t go there, live there » orchestrée par l’agence AKQA Paris, qui incitait les touristes à s’approprier les villes qu’ils visitent comme s’ils y habitaient, VOLONTIERS a pris ses quartiers dans le 11ème arrondissement de Paris.<br/>Une magnifique maison a été redécorée pour l’occasion, chaque pièce offrant une expérience immersive et authentique de la vie parisienne et de ses acteurs, à travers de nombreux ateliers autour de la musique, la culture, la gastronomie et du sport.'
      },
      preview: 'airbnb_house1.jpg',
      assets: [
        'AirBnB-13.jpg',
        'AirBnB-45.jpg',
        'AirBnB-55.jpg',
        'AirBnB-58.jpg',
        'AirBnB-80.jpg',
        'AirBnB-119.jpg',
        'AirBnB-120B_1.jpg',
        'AirBnB-125.jpg',
        'AirBnB-137.jpg',
        'AirBnB-145.jpg',
        'DSCF7845.jpg'
      ]
    },
    'airbnb-london': {
      'inHome': true,
      'name': 'airbnb london - la maison',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'To breathe life into the “Don’t go there, live there" AIRBNB campaign, orchestrated by the AKQA Paris agency, which purpose was to urge tourists to take possession of the cities they visited as locals would, VOLONTIERS took up residency in an Airbnb house in Paris first then in London, and imagined many workshops to pace said house during 4 days.<br/>In London, a magnificent home was redecorated for the occasion, each room offering its audience an immersive and authentic experience of London’s extremely vibrant local life through the same themes of music, culture, gastronomy and sports.',
        fr: 'Pour donner vie à la campagne AIRBNB « Don’t go there, live there » orchestrée par l’agence AKQA Paris qui consistait à exhorter les touristes à prendre possession des villes qu’ils visitaient comme des locaux, VOLONTIERS a pris ses quartiers dans une maison AirBNB à Paris d’abord, puis à Londres, et imaginé de nombreux ateliers pour rythmer ladite maison pendant 4 jours.<br/>A Londres, une magnifique maison a été re-décorée pour l’occasion, chaque pièce offrant au public une expérience immersive et authentique de la vie Londonienne et de ses acteurs, à travers différentes thématiques autour de la musique, la culture, la gastronomie et le sport.'
      },
      preview: 'AirBnb_Selects-4.jpg',
      assets: [
        'AirBnb_Selects-15.jpg',
        'AirBnb_Selects-26.jpg',
        'AirBnb_Selects-33.jpg',
        'AirBnb_Selects-53.jpg',
        'AirBnb_Selects-123.jpg',
        'AirBnb_Selects-140.jpg',
        'AirBnb_Selects-144.jpg',
        'AirBnb_Selects-239.jpg',
        'AirBnb_Selects.jpg'
      ]
    },
    'nike-rt-and-training': {
      'inHome': true,
      'name': 'nike r.t. and training',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'VOLONTIERS staged the NIKELAB × RICCARDO TISCI collection through a training session in which a group of Parisian influencers were invited to participate. A collaboration imagined to redefine training itself, it seemed appropriate to test the gear as soon as it was available in its natural habitat.<br/>This session, led by the artist NS DOS, offered to redefine the concept of training, both physically and psychologically, through derivatives of endurance and adaptability exercises lifted from Russian martial art Systema. A video-tracking device was recording each participant’s movements, transcribing the recorded data into images and sounds broadcast within the training space, in real time.<br/>A amazing feat to link places to actors and their environments, and to bring their activity through digital data visualization.',
        fr: 'VOLONTIERS a mis en scène la collection NIKELAB × RICCARDO TISCI à travers une session d’entrainement à laquelle participait un groupe d’influencers parisiens. <br/>Cette session, dirigée par l`artiste NS DOS, proposait de redéfinir le concept de l’entrainement, tant au niveau physique que psychologique, à travers des exercices d’endurance et d’adaptabilité dérivés de l’art martial russe Systema.<br/>Un dispositif de tracking video captait les mouvements des participants, les traduisait en data créant des images et des sons diffusés dans l’espace en temps réel.'
      },
      preview: 'Nike-RiccardoTisci-NovembreMagazine-RemiProcureur (1 sur 1)-9.jpg',
      assets: [
        '1.jpg',
        'Nike-RiccardoTisci-NovembreMagazine-RemiProcureur (1 sur 1)-12.jpg',
        'Nike-RiccardoTisci-NovembreMagazine-RemiProcureur (1 sur 1)-34.jpg',
        'Nike-RiccardoTisci-NovembreMagazine-RemiProcureur (1 sur 1)-60.jpg'
      ]
    },
    'pok-fete-de-la-musique-x-coca': {
      'inHome': true,
      'name': 'pok fete de la musique × coca',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'VOLONTIERS staged the NIKELAB × RICCARDO TISCI collection through a training session in which a group of Parisian influencers were invited to participate. A collaboration imagined to redefine training itself, it seemed appropriate to test the gear as soon as it was available in its natural habitat.<br/>This session, led by the artist NS DOS, offered to redefine the concept of training, both physically and psychologically, through derivatives of endurance and adaptability exercises lifted from Russian martial art Systema. A video-tracking device was recording each participant’s movements, transcribing the recorded data into images and sounds broadcast within the training space, in real time.<br/>A amazing feat to link places to actors and their environments, and to bring their activity through digital data visualization.',
        fr: 'VOLONTIERS a mis en scène la collection NIKELAB × RICCARDO TISCI à travers une session d’entrainement à laquelle participait un groupe d’influencers parisiens. <br/>Cette session, dirigée par l`artiste NS DOS, proposait de redéfinir le concept de l’entrainement, tant au niveau physique que psychologique, à travers des exercices d’endurance et d’adaptabilité dérivés de l’art martial russe Systema.<br/>Un dispositif de tracking video captait les mouvements des participants, les traduisait en data créant des images et des sons diffusés dans l’espace en temps réel.'
      },
      preview: 'DSC_0349.jpg',
      assets: [
        'DSC_0884.jpg',
        'DSC_1543.jpg',
        'DSC_1804.jpg',
        'DSC_9752.jpg'
      ]
    },
    'acg-nikelab': {
      'inHome': false,
      'name': 'acg nikelab',
      'type': Constants.TYPE.EVENT,
      'about': {
        en: 'To celebrate the release of the new ACG line as well as to highlight the visuals created by Novembre Magazine, VOLONTIERS transformed the NikeLab shop in Paris to offer journalists and influencers a chance to to discover the collection around a cocktail party and an exhibition of creations specially made for the event.',
        fr: 'Pour célébrer la sortie de la nouvelle ligne ACG ainsi que pour mettre en évidence les visuels créés par le magazine Novembre, VOLONTIERS a transformé la boutique NikeLab de Paris proposait aux journalistes et influencers invités de découvrir la collection autour d’un cocktail dinatoire et d’une exposition des creations fabriquées pour l’événement'
      },
      preview: 'ACG HO15 NIKELAB P75 LAUNCH EVENT-HD.jpg',
      assets: [
        '3I3A3934.jpg',
        '3I3A4006.jpg',
        '3I3A4140.jpg',
        '3I3A4289.jpg'
      ]
    },
    'nikelab-lunar': {
      'inHome': false,
      'name': 'nikelab lunar',
      'type': Constants.TYPE.RETAIL,
      'about': {
        en: '',
        fr: ''
      },
      preview: '3I3A2028.jpg',
      assets: [
        '3I3A2431.jpg'
      ]
    },
    'nikelab-talaria': {
      'inHome': false,
      'name': 'nikelab talaria',
      'type': Constants.TYPE.RETAIL,
      'about': {
        en: '',
        fr: ''
      },
      preview: '3I3A3788.jpg',
      assets: [
        '3I3A3793.jpg'
      ]
    },
    'nikelab-ricardo-tisci-bw': {
      'inHome': false,
      'name': 'nikelab ricardo tisci bw',
      'type': Constants.TYPE.RETAIL,
      'about': {
        en: '',
        fr: ''
      },
      preview: '3I3A7786.jpg',
      assets: [
        '3I3A7794.jpg'
      ]
    },
    'nikelab-x-olivier-rousteing': {
      'inHome': false,
      'name': 'nikelab × olivier rousteing',
      'type': Constants.TYPE.RETAIL,
      'about': {
        en: '',
        fr: ''
      },
      preview: 'OR KEYSHOT-1.jpg',
      assets: [
        '_Q0A2713 copie.jpg',
        '3I3A4346.jpg',
        '3I3A4361.jpg',
        'NIKE_OR3339.jpg'
      ]
    },
    'nikelab-x-kim-jones': {
      'inHome': false,
      'name': 'nikelab × kim jones',
      'type': Constants.TYPE.RETAIL,
      'about': {
        en: '',
        fr: ''
      },
      preview: '3I3A8050.jpg',
      assets: [
        'IMG_0865.jpg',
        'IMG_0869.jpg'
      ]
    }
  }
}
