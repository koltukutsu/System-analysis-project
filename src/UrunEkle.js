import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import * as alasql from "alasql";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

class UrunEkle extends Component {
  constructor(props) {
    super(props);

    this.state = { urunler: [] };
  }

  componentWillMount() {
    alasql(`
            CREATE LOCALSTORAGE DATABASE IF NOT EXISTS TacticalWorldDb;
            ATTACH LOCALSTORAGE DATABASE TacticalWorldDb;
            USE TacticalWorldDb;            
            `);

    alasql(`
            CREATE TABLE IF NOT EXISTS urunVM_ (
              barkod VARCAHR(25) PRIMARY KEY,
              isim VARCHAR(25) NOT NULL,
              fiyat NUMBER NOT NULL,
              miktar NUMBER NOT NULL
            );
          `);
  }
  urunBilgiAl() {
    const urunlerTable = alasql("SELECT * FROM urunVM_ ORDER BY isim DESC");
    this.setState({ urunler: urunlerTable });
  }

  componentDidMount() {
    this.urunBilgiAl();
  }
  addUrun() {
    const { barkod, isim, fiyat, miktar } = this.refs;
    if (!barkod.value) return;
    alasql("INSERT INTO urunVM_ VALUES ?", [
      {
        barkod: barkod.value,
        isim: isim.value,
        fiyat: fiyat.value,
        miktar: miktar.value,
      },
    ]);
    this.urunBilgiAl();
  }
  deleteUrun(barkod) {
    alasql("DELETE FROM urunVM_ WHERE barkod = ?", barkod);
    this.urunBilgiAl();
  }
  render() {
    const { urunler } = this.state;

    return (
      <main className="container">
        <h2 className="mt-4">Ürünleri Veri Merkezine Ekle</h2>
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
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                ref="isim"
                className="form-control"
                id="isim"
                placeholder="İsmi"
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                ref="fiyat"
                className="form-control"
                id="fiyat"
                placeholder="Fiyat"
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <input
                type="text"
                ref="miktar"
                className="form-control"
                id="miktar"
                placeholder="Miktar"
              />
            </div>
            <div className="form-group mx-sm-3 mb-2">
              <button
                type="button"
                className="bnt btn-primary mb-2"
                onClick={(e) => this.addUrun()}
              >
                Ekle
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
              {urunler.length === 0 && (
                <tr>
                  <td colSpan="5">Henüz veri yok</td>
                </tr>
              )}
              {urunler.length > 0 &&
                urunler.map((urun) => (
                  <tr>
                    <td>{urun.barkod}</td>
                    <td>{urun.isim}</td>
                    <td>{urun.fiyat}</td>
                    <td>{urun.miktar}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => this.deleteUrun(urun.barkod)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  }
}

export default UrunEkle;
