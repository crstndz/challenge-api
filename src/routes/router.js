const express = require("express");
const { promises } = require("fs");
const router = express.Router();
const fetch = require("node-fetch");

const url_all_items = "https://api.mercadolibre.com/sites/MLA/search?q=";
const url = "https://api.mercadolibre.com";

const json_author = {
  name: "Cristian",
  lastname: "Díaz",
};

const json_categories = {
  categories: [],
};

const json_status = {
  status: 200,
};

router.get("/", async (req, res) => {
  console.log();
  var _url = url_all_items + req.query.search
  var _items = await fetch(_url)
    .then((response) => response.json())
    .then((contenido) =>
      contenido.results.map((item) => {
        var _item = {
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            amount: item.price,
            decimals: 0,
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
        };
        return _item;
      })
    );

  res.json({
    author: json_author,
    breadcrumb: [],
    items: [_items],
    status: json_status,
  });
});

router.get("/:id", async (req, res) => {
  var id = req.params.id;
  var json_response = {};
  if (id == 1 || id == "undefined") {
    var _items = await fetch(url_all_items)
      .then((response) => response.json())
      .then((contenido) =>
        contenido.results.map((item) => {
          var _item = {
            id: item.id,
            title: item.title,
            price: {
              currency: item.currency_id,
              amount: item.price,
              decimals: 0,
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
          };
          return _item;
        })
      );
    json_response = {
      author: json_author,
      breadcrumb: [],
      items: _items,
      status: json_status,
    };
  } else {
    let _url = url + "/items/" + id;
    var _item = await fetch(_url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error == "resource not found" || data.error == "not_found") {
          json_status.status = 404;
          var item = [];
        } else {
          json_status.status = 200;
          var item = [
            {
              id: data.id,
              title: data.title,
              price: {
                currency: data.currency_id,
                amount: data.price,
                decimals: 0,
              },
              picture: data.thumbnail,
              condition: data.condition,
              free_shipping: data.shipping.free_shipping,
              sold_quantity: data.sold_quantity,
              description: "",
              category_id: data.category_id,
            },
          ];
        }
        return item;
      });

    var _breacrumbs = [];
    var _description = "";

    if (json_status.status === 200) {
      var _url_cat = url + "/categories/" + _item[0].category_id;
      _breacrumbs = await fetch(_url_cat)
        .then((response) => response.json())
        .then((category) => category.path_from_root);

      var _url_desc = url + "/items/" + id + "/description";
      _description = await fetch(_url_desc)
        .then((response) => response.json())
        .then((description) => description.plain_text);
    }

    json_response = {
      author: json_author,
      breadcrumb: _breacrumbs,
      items: _item,
      description: _description,
      status: json_status,
    };
  }

  res.json(json_response);
});


module.exports = router;
