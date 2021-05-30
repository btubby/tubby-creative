import React, { Component } from "react";
import Gallery from "react-photo-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { reveal as Menu } from "react-burger-menu";
import { Loader } from "./Loader";
import { Header, Container, TitleContainer, TitleImage } from "./App.styles";
import "./App.css";
import titleImage from "./tubbycreativeblack.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImage: 0,
      opacity: 1,
      menuOpen: false,
    };
  }

  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }

  listenScrollEvent = (e) => {
    let opacity = 1;

    if (window.scrollY > 100) {
      opacity = 0.9;
    }
    if (window.scrollY > 200) {
      opacity = 0.7;
    }
    if (window.scrollY > 400) {
      opacity = 0.5;
    }
    if (window.scrollY > 600) {
      opacity = 0.3;
    }
    // console.log(`Y: ${window.scrollY} opacity: ${opacity}`);
    this.setState({ opacity: opacity });
  };

  componentWillMount() {
    //const tag = "storyboards";
    const url =
      "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
      // "&api_key=f29dc69a4a6889fb21115bc54e8f432b" +
      // "&user_id=willtubby" +
      "&api_key=52f7e77ccc225a2c6cda920bb6173fb5" +
      "&user_id=tubbycreative" +
      "&sort=date-taken-desc" +
      // "&tags=" +
      // tag +
      "&tag_mode=all" +
      "&extras=tags,date_upload,date_taken,media,url_n,url_l,url_z,url_o&per_page=300&page=1" +
      "&format=json" +
      "&nojsoncallback=1";
    console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        this._isMounted = true;
        // if (this._isMounted) {
        this.setState({
          images: result.photos.photo.map(this.processFickrImagesOrVideo),
        });
      });
  }
  // https://code.flickr.net/2008/05/01/videos-in-the-flickr-api/
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
    console.log("open contact dropdown");
    document.getElementById("myNav").style.display = "block";
  };

  closeNav = () => {
    console.log("CLOSE contact dropdown");
    document.getElementById("myNav").style.display = "none";
  };

  openLightbox = (event, entry) => {
    if (entry.photo.media === "video") {
      console.log(`id ${entry.id} is a video. Fetching further data`);
      const url =
        "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&" +
        "&api_key=52f7e77ccc225a2c6cda920bb6173fb5" +
        "&photo_id=" +
        entry.photo.id +
        "&format=json" +
        "&nojsoncallback=1";
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          result.sizes.size.map((video) => {
            if (video.label === "Video Player") {
              window.open(video.url, '_blank');
            }
          });
        });
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

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
    document
      .getElementsByClassName("bm-menu")[0]
      .addEventListener("click", function(event) {
        console.log("menu clicked!");
        // this.closeNav();
      });
  }
  render() {
    return (
      <Container>
        <div id="myNav" className="overlay">
          <a
            href="javascript:void(0)"
            className="closebtn"
            onClick={this.closeNav}
          >
            &times;
          </a>

          <div className="overlay-content">
            Visualiser
            <br />
            Bass Guitarist
            <br />
            Call Will on 07989742643
            {/* <br />
            <a href="mailto:will@tubbycreative.com">EMAIL WILL</a> */}
          </div>
        </div>
        <Header>
          <Menu
            right
            pageWrapId={"pagewrap"}
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
            <a id="about" className="menu-item" href="#">
              Image
            </a>
            <a
              id="about"
              className="menu-item"
              target="_"
              href="https://soundcloud.com/willtubby"
            >
              Audio
            </a>
            <a
              id="about"
              className="menu-item"
              target="_"
              href="https://www.youtube.com/user/willtubby/videos"
            >
              Video
            </a>
            <a id="contact" className="menu-item" onClick={this.openNav}>
              Contact
            </a>
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
          {this._isMounted && (
            <Gallery
              photos={this.state.images}
              // direction={"column"}
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
              showImageCount={false}
              backdropClosesModal={true}
              showThumbnails={true}
              imageLoadErrorMessage={"TubbyCreative Error"}
              // toolbarButtons={[]}
              enableZoom={false}
              imagePadding={3}
            />
          )}
        </div>
      </Container>
    );
  }
  //END
}

export default App;
