import React, { Component } from "react";
import Gallery from "react-photo-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { reveal as Menu } from "react-burger-menu";
import { Loader } from "./Loader";
import { Header, Container, TitleContainer, TitleImage, WillText } from "./App.styles";
import "./App.css";
import titleImage from "./tubbycreativeblack.png";
import { SocialIcon } from 'react-social-icons';

// % yarn run deploy_will; cd build
// bentubby@Bens-Air build % scp -r static user_1081867768@ssh.tubbycreative.com:/home/linweb37/t/tubbycreative.com-1081867769/user/htdocs
// user_1081867768@ssh.tubbycreative.com's password: Dexter101
//
// 1.2b323b23.chunk.css                                                                                                                                           100% 7399   374.9KB/s   00:00    
// 1.2b323b23.chunk.css.map                                                                                                                                       100%   11KB 580.6KB/s   00:00    
// main.c0fedf94.chunk.css.map                                                                                                                                    100% 5029   237.9KB/s   00:00    
// main.c0fedf94.chunk.css                                                                                                                                        100% 1675    96.8KB/s   00:00    
// 1.50d7de54.chunk.js.map                                                                                                                                        100% 1195KB   5.4MB/s   00:00    
// 1.50d7de54.chunk.js                                                                                                                                            100%  320KB   4.1MB/s   00:00    
// runtime~main.229c360f.js.map                                                                                                                                   100% 7996   395.1KB/s   00:00    
// main.16694ab3.chunk.js                                                                                                                                         100% 7961   328.8KB/s   00:00    
// main.16694ab3.chunk.js.map                                                                                                                                     100%   23KB 879.9KB/s   00:00    
// runtime~main.229c360f.js                                                                                                                                       100% 1502    64.4KB/s   00:00    
// tubbycreativeblack.d7030dc8.png           
//                                                                                                                     100%  104KB   1.8MB/s   00:00    
// bentubby@Bens-Air build % scp index.html user_1081867768@ssh.tubbycreative.com:/home/linweb37/t/tubbycreative.com-1081867769/user/htdocs 
// user_1081867768@ssh.tubbycreative.com's password: 
// index.html   

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImage: 0,
      opacity: 1,
      menuOpen: false,
      nextpage:"",
    };
  }
  _isMounted = false;
  componentWillUnmount() {
    this._isMounted = false;
  }
  listenScrollEvent = (e) => {
    let opacity = 1;
    if (window.scrollY > 100) {opacity = 0.9;}
    if (window.scrollY > 200) {opacity = 0.7;}
    if (window.scrollY > 400) {opacity = 0.5;}
    if (window.scrollY > 600) {opacity = 0.3; }
    // console.log(`Y: ${window.scrollY} opacity: ${opacity}`);
    this.setState({ opacity: opacity });

    // Implement infinite scroll
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
    if (bottom) {
      // console.log(`at the bottom ${this.state.nextpage}`);
      this.__fetchInsta(this.state.nextpage)
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
    document
      .getElementsByClassName("bm-menu")[0]
      .addEventListener("click", function(event) {
      });
  }
  componentWillMount() {
    //const tag = "storyboards";
    let source = this.getSourceString();
    console.log(`Fetching from source [${source}]`)
    if (source === 'insta') {
      this._fetchInsta();
    } else {
      this._fetchFlickr();
    }
    this._isMounted = true;
  }
  _fetchInsta() {
    // const access_token= "IGQVJVX3ZAPVEpjV0R3TmU1SzBoN0JFUWxRUHk0REJTekNYeWxkSXVDT0VlTDVGR2JldVd4VUJUb1JjV2h1MlZAad1FwWTN2VUo2TTB6eDRHOHZAZAc19VWmM4ZAjdkRHlxT3hKMkpnYmtBSktxc2ZArUVk1ZAwZDZD"
    // BT updated 31/01/23
    const access_token= "IGQVJVSzBYWWJqc0lnY3FnX1QwUlRHRzBuQ2FyaFI4ZAU1JeV9nTHU4cFMyRGl3TEVaOHI5MGI3S2VfYVlfbFYtMnZAOZA2V6NWRha1dmTml1RU94X1RuUmNoV3pURjFBMTdmcVdVeWIzajM3bzAtZAU91RAZDZD"
    // const access_token= "IGQVJVWi1FMzZAoMVBWRWZAVUWZAqZAmxyQ2RNa3JKSG9aQm4wTnNZAREtwT29lN2JOQWxVY3M1MGV4eVA3YzlvV2NyYVhCSnlGZAy1Ha1pUVDZAWaE9Obktfa3pGbXU4azJRT1owTHJGbktDMFpyNF9hNklWdwZDZD"
    const insturl= "https://graph.instagram.com/me/media"
    + "?fields=id,permalink,thumbnail_url,caption,media_url,media_type"
    + "&limit=50"
    ;
    this.__fetchInsta(insturl+ "&access_token=" + access_token);
  };
  __fetchInsta(insturl) {
    fetch(insturl )
    .then((res) => res.json())
    .then((result) => {
      this.setState({
        // images: result.data.map(this.processInsta),
        images:  [...this.state.images, ...result.data.map(this.processInsta) ] ,
        // result.data.map(this.processInsta),
        nextpage: result.paging.next
      });
    });

  }
  processInsta = (entry) => {
    return {
      className: entry.media_type === 'VIDEO' ? 'is_video' : 'is_image',
      source: 'insta',
      id: entry.id,
      src: entry.thumbnail_url||entry.media_url,
      hires:entry.thumbnail_url|| entry.media_url,
      width: entry.thumbnail_url ? 600 : 300,
      height:entry.thumbnail_url ? 336 : 300,
      media_type: entry.media_type,
      permalink: entry.permalink,
      thumbnail_url: entry.thumbnail_url,
    };
  };
  getSourceString() { // flickr or insta
    let search = window.location.search
    let x = search.split("=")[1];
    this.setState({source: x});
    return x;
  };
  _fetchFlickr() {
    const url =
    "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
    "&api_key=52f7e77ccc225a2c6cda920bb6173fb5" +
    "&user_id=tubbycreative" +
    "&sort=date-taken-desc" +
    "&tag_mode=all" +
    "&extras=tags,date_upload,date_taken,media,url_n,url_l,url_z,url_o&per_page=300&page=1" +
    "&format=json" +
    "&nojsoncallback=1";
  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      this.setState({
        images: result.photos.photo.map(this.processFickrImagesOrVideo),
      });
    });
  };
  processFickrImagesOrVideo = (entry) => {
    return {
      media: entry.media,
      id: entry.id,
      src: entry.url_z,
      hires: entry.url_l,
      height: parseInt(entry.height_z),
      width: parseInt(entry.width_z),
    };
  };
  openNav = () => {
    document.getElementById("myNav").style.display = "block";
  };
  closeNav = () => {
    document.getElementById("myNav").style.display = "none";
  };
  openLightbox = (event, entry) => {
    console.log(entry)
    if (entry.photo.source === 'insta') {
      console.log(entry.photo)
      // this.setState({
      //   currentImage: entry.index,
      //   lightboxIsOpen: true,
      // });
      window.open(entry.photo.permalink, '_blank', 'noopener,noreferrer');
      return;
    }
    // FLICKR......
    if (entry.photo.media === "video") {
      // // console.log(`id ${entry.id} is a video. Fetching further data`);
      // const url =
      //   "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&" +
      //   "&api_key=52f7e77ccc225a2c6cda920bb6173fb5" +
      //   "&photo_id=" +
      //   entry.photo.id +
      //   "&format=json" +
      //   "&nojsoncallback=1";
      // fetch(url)
      //   .then((res) => res.json())
      //   .then((result) => {
      //     console.log(result);
      //     result.sizes.size.map((video) => {
      //       if (video.label === "Video Player") {
      //         window.open(video.url, '_blank');
      //       }
      //       return true;
      //     });
      //   });
    } else {
      this.setState({
        currentImage: entry.index,
        lightboxIsOpen: true,
      });
    }
  };
  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  };
  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  };
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  };
  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu = () => {
    console.log("closing the menu");
    this.setState({ menuOpen: false });
  };
  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }


  
  render() {
    
    return (
      <Container>
    
        <Header>
          <Menu
            right
            pageWrapId={"pagewrap"}
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
              <SocialIcon network="flickr" fgColor="#373A47" bgColor="grey" url="?source=flickr" />
              <SocialIcon network="instagram" fgColor="#373A47" bgColor="grey" url="?source=insta"/>
              <SocialIcon target="_blank" network="soundcloud" fgColor="#373A47" bgColor="grey" url="https://soundcloud.com/willtubby" />
              <SocialIcon target="_blank" network="youtube" fgColor="#373A47" bgColor="grey" url="https://www.youtube.com/user/willtubby/videos" />
            <WillText>
            Visualiser
            <br />
            Bass Guitarist
            <br />
            Call Will on 07989742643
            </WillText>
          </Menu>
          <TitleContainer>
            <TitleImage
              style={{ opacity: this.state.opacity }}
              src={titleImage}
            />
          </TitleContainer>
        </Header>
        <div id="pagewrap">
          {!this._isMounted && <Loader />}
          {this._isMounted && this.state.images.length && (
            <Gallery
              photos={this.state.images}
              direction={"column"}
              onClick={this.openLightbox}
            />
          )}

          {this.state.lightboxIsOpen && (
            <Lightbox
              mainSrc={
                this.state.images[this.state.currentImage]
                  ? this.state.images[this.state.currentImage].hires
                  : this.state.images[0].src
              }
              nextSrcThumbnail={
                this.state.images[this.state.currentImage + 1].src
              }
              nextSrc={
                this.state.images[this.state.currentImage + 1]
                  ? this.state.images[this.state.currentImage + 1].hires
                  : this.state.images[0].src
              }
              prevSrc={
                this.state.images[this.state.currentImage - 1]
                  ? this.state.images[this.state.currentImage - 1].hires
                  : this.state.images[0].src
              }
              onAfterOpen={this.closeMenu}
              onCloseRequest={this.closeLightbox}
              onMovePrevRequest={this.gotoPrevious}
              onMoveNextRequest={this.gotoNext}
              preloadNextImage={true}
              showImageCount={true}
              backdropClosesModal={true}
              showThumbnails={true}
              imageLoadErrorMessage={"TubbyCreative Error"}
              enableZoom={true}
              imagePadding={3}
              // imageCaption={"<a href='dd'>ddd</a>"}
            />
          )}
        </div>
      </Container>
    );
  }
  //END
}

export default App;
