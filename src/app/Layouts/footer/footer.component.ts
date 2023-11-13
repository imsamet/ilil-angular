import { AfterViewInit, Component, OnInit } from "@angular/core";
import { register } from 'swiper/element/bundle';

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit, AfterViewInit {

    imagePaths: any[] = [];
    date = new Date();

    ngOnInit(): void {
        this.imagePaths = [
            { name: "mac.svg" },
            { name: "ALUSTDUL-WOODS.svg" },
            { name: "mercedes-.svg" },
            { name: "AL_KARAM-GROUP-.svg" },

            { name: "Adri-Consulting-2.svg" },
            { name: "Asset-1-1.svg" },
            { name: "Beaty-feed-19.svg" },
            { name: "CASIO-11.svg" },

            { name: "CONVECT-.svg" },
            { name: "DARWISH-ELECTRONICS-27.svg" },
            { name: "EDIFICE-METAVERSAL-.svg" },
            { name: "EGT-10.svg" },
            { name: "EINZIG-ArtIG-25.svg" },
            { name: "ELECTRONICS-MEGASTORE-23.svg" },
            { name: "FIS-.svg" },
            { name: "Fantom-.svg" },
            { name: "Goldsky-16.svg" },
            { name: "IDHALL-.svg" },
            { name: "JAMWEEL-.svg" },
            { name: "KERONA-.svg" },
            { name: "LAYALI-.svg" },
            { name: "LET-JORDAN-GREEN-20.svg" },
            { name: "Lenova-.svg" },
            { name: "Mazra3te-8.svg" },
            { name: "PITLLCO-GLOBAL-SOURCING.svg" },
            { name: "Philadelphia-Solar-24.svg" },
            { name: "Porsche-9.svg" },
            { name: "RETRO-STORES-21.svg" },
            { name: "RETROSPECT-.svg" },
            { name: "ROLEX-.svg" },
            { name: "RUH-AVIATION-.svg" },
            { name: "Roca-29.svg" },
            { name: "SKYDINE-JORDAN-.svg" },
            { name: "SUNERGY-SOLAR-.svg" },
            { name: "Shams-Pharma-Group-svg.svg" },
            { name: "THE-INCREDIBLE-OAT-22.svg" },
            { name: "Trans-Pass.svg" },
            { name: "WOODOXY-ART-1.svg" },
            { name: "alo-amman-giveaway.svg" },
            { name: "honey-pot.svg" },

            { name: "الحيالي.svg" },
        ];
    }

    ngAfterViewInit(): void {
        register();
        const swiperEl = document.querySelector('swiper-container');
        const swiperParams = {
            slidesPerView: 1,
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

}