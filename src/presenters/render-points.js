import Point from '../views/point';
import PointEdit from '../views/point-edit';
import {getIcon, getNewData} from '../utils.js';
import ModelPoint from '../model/model-point';
import renderPoints from '../presenters/render-points';
import {ICONS_ARRAY} from '../constants';

const pointWrapper = document.querySelector(`.trip-day__items`);

const deletePoint = (points, i) => {
  points.splice(i, 1);
  return points;
};

export default (points, destinations, offers, provider) => {
  pointWrapper.textContent = ``;
  const fragment = document.createDocumentFragment();

  points.forEach((point, i) => {
    const PointComponent = new Point(point);
    const PointEditComponent = new PointEdit(point, destinations, offers);

    const disableForm = (isDisabled) => {
      const inputs = PointEditComponent.element.querySelectorAll(`input`);
      PointEditComponent.element.querySelector(`[type=submit]`).disabled = isDisabled;
      PointEditComponent.element.querySelector(`[type=reset]`).disabled = isDisabled;
      for (const input of inputs) {
        input.disabled = isDisabled;
      }
    };

    PointComponent.onClick = () => {
      PointEditComponent.render();
      pointWrapper.replaceChild(PointEditComponent.element, PointComponent.element);
      PointComponent.unrender();
    };

    PointEditComponent.onSubmit = (data) => {
      PointEditComponent.element.querySelector(`[type=submit]`).innerText = `Saving...`;
      disableForm(true);

      point.title = data.title;
      point.destination = data.destination;
      point.dateFrom = data.dateFrom;
      point.dateTo = data.dateTo;
      point.price = data.price;
      point.offers = data.offers;

      provider.updatePoint({id: point.id, data: point.toRAW()})
        .then((updatedData) => {
          PointComponent.update(ModelPoint.parsePoint(updatedData));
          PointComponent.render();
          pointWrapper.replaceChild(PointComponent.element, PointEditComponent.element);
          PointEditComponent.unrender();
        })
        .catch(() => {
          PointEditComponent.element.querySelector(`[type=submit]`).innerText = `Save`;
          PointEditComponent.shake();
          disableForm(false);
        });
    };

    PointEditComponent.onDelete = () => {
      PointEditComponent.element.querySelector(`[type=reset]`).innerText = `Deleting...`;
      disableForm(true);

      provider.deletePoint({id: point.id})
        .then(() => {
          deletePoint(points, i);
          PointEditComponent.unrender();
        })
        .then(() => provider.getPoints())
        .then(renderPoints)
        .catch(() => {
          PointEditComponent.element.querySelector(`[type=reset]`).innerText = `Delete`;
          PointEditComponent.shake();
          disableForm(false);
        });
    };

    PointEditComponent.onEsc = () => {
      PointComponent.render();
      pointWrapper.replaceChild(PointComponent.element, PointEditComponent.element);
      PointEditComponent.unrender();
    };

    PointEditComponent.onSelect = () => {
      let label = PointEditComponent.element.querySelector(`.travel-way__label`);
      let toggleInput = PointEditComponent.element.querySelector(`#travel-way__toggle`);
      let iconInput = PointEditComponent.element.querySelector(`#travel-way__icon`);

      const title = PointEditComponent.element.querySelector(`.travel-way__select-input:checked`).value;
      const icon = getIcon(ICONS_ARRAY, title);

      toggleInput.value = title;
      iconInput.value = icon;
      const newOffers = points.find((it) => it.title === toggleInput.value).offers;

      label.textContent = icon;
      toggleInput.checked = false;

      const newData = getNewData(points, i, {title, icon, offers: newOffers});
      PointEditComponent.update(newData);
      PointEditComponent.rerender();
    };
    fragment.appendChild(PointComponent.render());
  });
  pointWrapper.appendChild(fragment);
};
