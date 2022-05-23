import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import * as alasql from "alasql";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

class FisHazirla extends Component {
  constructor(props) {
    super(props);
    this.state = { fis: [], toplam: 0, urunlerMiktarlar: {} };
  }

  componentWillMount() {
    alasql(`
            CREATE LOCALSTORAGE DATABASE IF NOT EXISTS TacticalWorldDb;
            ATTACH LOCALSTORAGE DATABASE TacticalWorldDb;
            USE TacticalWorldDb;
            `);

    alasql(`
            CREATE TABLE IF NOT EXISTS fisVM (
              fisID VARCAHR(8) PRIMARY KEY,
              urunler VARCHAR NOT NULL,
              toplam NUMBER NOT NULL
            );
          `);
  }
  getQuery(barkod, miktar) {
    const urunlerTable = alasql(
      "SELECT * FROM urunVM_ WHERE barkod = ?",
      barkod
    );
    const urunAlinan = urunlerTable[0];

    console.log(urunAlinan);
    var kaydedilenMiktar = urunAlinan.miktar;
    if (miktar > parseInt(urunAlinan.miktar)) {
      alert(
        `Elde olandan fazla alamazsiniz ${urunAlinan.miktar} elde olan. ${miktar} istenilen `
      );
    } else {
      if (this.state.urunlerMiktarlar[`${barkod}`] === undefined) {
        var newUrunMiktarObject = {};
        console.log("bulunmadi");
        newUrunMiktarObject[`${barkod}`] = parseInt(miktar);
        console.log(newUrunMiktarObject);
        console.log(miktar);
        let resultUrunler = Object.assign(
          this.state.urunlerMiktarlar,
          newUrunMiktarObject
        );
        this.setState({ urunlerMiktarlar: resultUrunler });
      } else {
        console.log("bulundu");
        let arttirilmisMiktar =
          parseInt(this.state.urunlerMiktarlar[`${barkod}`]) + parseInt(miktar);
        console.log("arrtirilmis miktar", arttirilmisMiktar);
        console.log("urun normal miktar", urunAlinan.miktar);

        for (var i = 0; i < this.state.fis.length; i++) {
          console.log(i);
          var current_barkod = this.state.fis[i].barkod;
          var current_miktar = this.state.fis[i].miktar;
          console.log(current_barkod, barkod);
          console.log("eslestirme ->", current_barkod == barkod);
          console.log(current_miktar);
          if (current_barkod == barkod) {
            console.log("icerdeyiz ve barkod degeri ", current_barkod);
            console.log("arttirilan deger", arttirilmisMiktar);
            console.log("current deger ", current_miktar);
            console.log("statement", arttirilmisMiktar > current_miktar);
            if (arttirilmisMiktar > kaydedilenMiktar) {
              alert(
                `${
                  arttirilmisMiktar - kaydedilenMiktar
                } tane fazla almak istediniz fakat stokta yok!`
              );
              return;
            }
          }
        }
        var yeniUrunlerMiktarlar = Object.assign(
          {},
          this.state.urunlerMiktarlar
        );
        yeniUrunlerMiktarlar[`${barkod}`] = arttirilmisMiktar;
        this.setState({ urunlerMiktarlar: yeniUrunlerMiktarlar });
      }

      urunAlinan.miktar = miktar;
      this.setState({ fis: [...this.state.fis, urunAlinan] });
      this.setState({
        toplam:
          this.state.toplam +
          parseInt(urunAlinan.miktar) * parseInt(urunAlinan.fiyat),
      });
    }
    console.log(this.state.urunlerMiktarlar);
    console.log(this.state.fis);
  }
  addFis(e) {
    e.preventDefault();
    console.log("basildi");
    if (!this.state.fis.length && !this.state.toplam) return;
    var urunler = [];
    for (var i = 0; i < this.state.fis.length; i++) {
      urunler.push(this.state.fis[i].barkod);
    }
    console.log(urunler.join(", "));
    alasql("INSERT INTO fisVM VALUES ?", [
      {
        fisID: Math.random().toString().substr(2, 8),
        urunler: urunler.join(", "),
        toplam: this.state.toplam,
      },
    ]);
    const taken = alasql("SELECT * FROM fisVM42 ORDER BY isim DESC");
    console.log(taken);
  }
  temizleFis(e) {
    e.preventDefault();
    console.log("basildi");
    this.setState({ fis: [] });
  }

  addUrunler() {
    const { barkod, miktar } = this.refs;

    if (!barkod.value) return;
    // for (var i = 0; i < this.state.fis.length; i++) {
    //   var current_barkod = this.state.fis[i].barkod;
    //   var current_miktar = this.state.fis[i].barkod;
    //   console.log("kontrol");
    //   console.log(barkod);
    //   console.log(this.state.urunlerMiktarlar[`${current_barkod}`]);
    //   console.log(this.state.urunlerMiktarlar);
    //   console.log(current_miktar);
    //   if (
    //     parseInt(this.state.urunlerMiktarlar[`${current_barkod}`]) >
    //     parseInt(current_miktar)
    //   ) {
    //     alert(
    //       `${
    //         this.state.urunlerMiktarlar[`${current_barkod}`] - current_miktar
    //       } fazla tane almak istediniz fakat stokta yok!`
    //     );
    //     return;
    //   }
    //   // if (current_barkod === barkod.value) {
    //   //   alert(`${current_barkod} ayni barkoddan iki kere ekleme yapilamaz!`);
    //   //   return;
    //   // }
    // }

    const barkod_control = barkod.value;
    const miktar_control = miktar.value;
    this.getQuery(barkod_control, miktar_control);
  }
  render() {
    const { fis } = this.state;

    return (
      <main className="container">
        <h2 className="mt-4">Ürünleri Fişe Ekle</h2>
        <Button variant="outlined">
          <Link to="/">Ekle</Link>
        </Button>
        <Button variant="outlined">
          <Link to="/fishazirla">Fiş Hazırla</Link>
        </Button>

        <div className="row mt-4">
          <form>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                ref="barkod"
                className="form-control"
                id="inputName"
                placeholder="Barkod"
              />
              <input
                type="text"
                ref="miktar"
                className="form-control"
                id="inputName"
                placeholder="Miktar"
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <button
                type="button"
                className="bnt btn-primary mb-2"
                onClick={(e) => this.addUrunler()}
              >
                Fişe Ekle
              </button>
            </div>
          </form>
        </div>

        <div>
          <table className="table table-primary table-striped">
            <thead>
              <tr>
                <th scope="col">Barkod</th>
                <th scope="col">İsim</th>
                <th scope="col">Fiyat</th>
                <th scope="col">Miktar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fis.length === 0 && (
                <tr>
                  <td colSpan="5">Henüz veri yok</td>
                </tr>
              )}
              {fis.length > 0 &&
                fis.map((urun) => (
                  <tr>
                    <td>{urun.barkod}</td>
                    <td>{urun.isim}</td>
                    <td>{urun.fiyat}</td>
                    <td>{urun.miktar}</td>
                    <td></td>
                  </tr>
                ))}

              <tr>
                <td>TOPLAM = {this.state.toplam}</td>
                <td>
                  <button
                    type="button"
                    className="bnt btn-primary mb-2"
                    onClick={(e) => this.addFis(e)}
                  >
                    Fişi Veri Merkezine Kaydet
                  </button>
                  <div className="fill-div"></div>
                  <button
                    type="button"
                    className="bnt btn-primary mb-2"
                    onClick={(e) => this.temizleFis(e)}
                  >
                    Fişi Temizle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    );
  }
}

export default FisHazirla;
