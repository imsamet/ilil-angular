import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  array: any[] = [];

  ngOnInit(): void {
    const links = [
      "https://www.geosentetiklerdernegi.org.tr/",
      "http://aicaturkey.org/",
      "https://www.kas.de/tr/web/tuerkei",
      "https://www.amnesty.org.tr/",
      "https://www.kkgiad.org/",
      "https://turkey.fes.de/",
      "https://tr.boell.org/tr",
      "https://www.freiheit.org/tr/turkiye",
      "https://www.iata.org/",
      "https://www.deik.org.tr/",
      "https://istanbul.taiwantrade.com/",
      "https://pro-animale.de/pro-animale-international/tuerkei/?lang=en",
      "https://www.dtr-ihk.de/tr/",
      "https://www.jetro.go.jp/turkey/",
      "https://aritweb.org/",
      "https://www.suny.edu.tr/",
      "https://www.crisisgroup.org/",
      "http://www.cisvturkey.org/index.php",
      "https://www.icmc.net/",
      "https://archive.friendshipforce.org/",
      "https://www.ndi.org/",
      "https://www.yyd.org.tr/tr",
      "https://www.kirimdernegi.org.tr/",
      "https://www.katead.org.tr/",
      "https://nauticalarch.org/",
      "https://hollingscenter.org/",
      "https://www.iri.org/",
      "https://web.gencat.cat/ca/inici",
      "https://www.goalglobal.org/",
      "https://www.rescue.org/",
      "https://pro.drc.ngo/",
      "https://www.care.org/",
      "https://www.concern.net/",
      "https://www.americanbar.org/en/",
      "https://www.welthungerhilfe.org/",
      "https://globalcommunities.org/",
      "https://www.ri.org/",
      "https://www.islamicrelief.org.tr/",
      "https://www.acted.org/en/",
      "https://setf.ngo/",
      "https://theret.org/",
      "https://aarjapan.gr.jp/tr/",
      "https://www.nzte.govt.nz/",
      "https://mentor-initiative.org/",
      "https://www.malteser-international.org/en.html",
      "https://spark.ngo/",
      "https://www.atlanticcouncil.org/",
      "https://www.ieee.org.tr/",
      "https://www.americancouncils.org/ACET",
      "https://humanappeal.org.uk/",
      "https://mercyusa.org/",
      "https://www.uossm.org.tr/",
      "https://www.qcharity.org/en/qa",
      "https://waipa.org/",
      "https://www.ashrae.org/",
      "https://www.fikretyukselfoundation.org/",
      "https://www.worldinstituteofpain.org/",
      "https://reals.org/en/index.html",
      "https://www.zurich.foundation/",
      "https://www.savethechildren.net/",
      "https://www.stichtingantre.nl/",
      "https://www.danchurchaid.org/",
      "https://ajinter.org/",
      "https://srd.ngo/",
      "https://www.ima-network.org/",
      "https://www.alanyansuomalaiset.fi/",
      "https://www.ismrm.org/",
      "https://baitussalam.org/",
      "https://www.zakat.org/",
      "https://unitedwork.com.tr/tr/",
      "https://sparkassenstiftung-turkey.org/",
      "https://donate.sema-sy.org/",
      "https://tutelimitr.com/",
      "https://www.rahma-austria.at/tr/",
      "https://actionforhumanity.org/",
      "https://www.peopleinneed.net/",
      "https://www.islamichelp.org.uk/",
      "https://pmm.org.pl/",
      "https://www.halotrust.org/",
      "https://ciltinternational.org/",
      "https://www.charita.cz/en/",
      "https://www.projecthope.org/",
      "https://www.wvi.org/",
      "https://buildingmarkets.org/",
      "https://helptheneedycharitabletrust.com/",
      "https://wefa.org/",
      "https://www.kizilay.org.tr/",
      "https://tegv.org/",
      "https://www.tev.org.tr/anasayfa/tr",
      "https://www.ted.org.tr/",
      "https://www.tog.org.tr/",
      "https://www.tema.org.tr/",
      "http://www.sendegel.org.tr/",
      "https://www.yesilyurtkentkonseyi.org/",
      "https://kalben.org.tr/",
      "https://www.keged.org.tr/",
      "https://www.hayatadestek.org/",
      "https://www.greenpeace.org/international/",
      "https://genchayat.org/",
      "https://www.cydd.org.tr/",
      "https://www.akut.org.tr/",
      "https://www.acev.org/",
      "https://www.agder.org.tr/",
      "https://aiesec.org/",
      "https://adimadim.org/",
      "https://www.ayder.org.tr/",
      "https://aktifyasam.org.tr/"
    ]
    var j = 0;
    for (let i = 1; i <= 213; i += 2) {
      const imageNumber = i.toString().padStart(3, '0');
      const imageObject = {
        link: links[j],
        image: `assets/ngo-logos/image${imageNumber}.png`
      };
      this.array.push(imageObject);
      j++;
    }

  }

  ngAfterViewInit(): void {
    register();
    const swiperEl = document.querySelector('swiper-container');
    const swiperParams = {
      breakpoints: {
        320: {
          slidesPerView: 4,
          spaceBetween: 20
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 10,
          spaceBetween: 40,
        },
      },
      autoplay: {
        delay: 1500,
        disableOnInteraction: false
      },
      pagination: {
        enabled: true,
        dynamicBullets: true,
        clickable: true
      },
      grabCursor: true,
      loop: true,
      mousewheel: {
        forceToAxis: true,
      },
      on: {
        init() {
        },
      },
    };
    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }

  ngOnDestroy(): void {
    const swiperEl = document.querySelector('swiper-container');
    swiperEl.remove();
  }
}
