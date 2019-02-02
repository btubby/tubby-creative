import React, { Component } from "react";
import Gallery from "react-photo-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { reveal as Menu } from "react-burger-menu";
import styled from "styled-components";
import "./App.css";

import { Loader } from "./Loader";

const Container = styled.div`
  display: relative;
  flex-direction: column;
`;
// http://tubbycreative.com/Tubbytext/tubbycreative.gif
const Header = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  background-size: 50%;
  opacity: 0.7;
  color: white;
  width: 100%;
  height: 110px;
  padding: 0;
  margin: 0;
  vertical-align: middle;
  text-align: center;
  height: 6vw;
  padding-top: 10px;
  opacity: 1;
`;
const TubbyCreative = styled.img`
  //max-height: 40px;
  width: 60%;
`;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImage: 0,
      opacity: 1,
      menuOpen: false
    };
  }

  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }

  listenScrollEvent = e => {
    if (window.scrollY > 400) {
      this.setState({ opacity: 0 });
    } else {
      this.setState({ opacity: 1 });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
  }

  componentWillMount() {
    const tag = "storyboards";
    const url =
      "https://api.flickr.com/services/rest/?method=flickr.photos.search&nojsoncallback=1" +
      "&api_key=f29dc69a4a6889fb21115bc54e8f432b" +
      "&user_id=willtubby" +
      "&sort=date-taken-desc" +
      "&tags=" +
      tag +
      "&tag_mode=all" +
      "&extras=tags,date_upload,date_taken,media,url_n,url_l,url_z,url_o&per_page=300&page=1" +
      "&format=json" +
      "&nojsoncallback=1";
    fetch(url)
      .then(res => res.json())
      .then(result => {
        console.log(result);
        this._isMounted = true;
        // if (this._isMounted) {
        this.setState({
          images: result.photos.photo.map(image => ({
            src: image.url_z,
            hires: image.url_l,
            height: parseInt(image.height_z),
            width: parseInt(image.width_z)
          }))
        });
        // }
      });
  }
  openLightbox = (event, obj) => {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  };
  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  };
  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  };
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1
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
            pageWrapId={"pagewrap"}
            isOpen={this.state.menuOpen}
            onStateChange={state => this.handleStateChange(state)}
          >
            <a id="home" className="menu-item" href="/">
              Will Tubby
              <br />
              Visualiser
              <br />
              Available for work
              <br />
              07989 742643
            </a>
            <a id="about" className="menu-item" href="/about">
              About
            </a>
            <a id="contact" className="menu-item" href="/contact">
              Contact
            </a>
          </Menu>
          <TubbyCreative
            style={{ opacity: this.state.opacity }}
            src={
              "http://tubbycreative.com/tubbycreative/tubbycreativeblack.png"
            }
          />
        </Header>
        <div id="pagewrap">
          {!this._isMounted && <Loader />}
          {this._isMounted && (
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
