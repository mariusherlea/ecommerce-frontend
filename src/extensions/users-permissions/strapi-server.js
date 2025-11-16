'use strict';

module.exports = (plugin) => {
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // ➤ interceptăm crearea userului
  const originalCreate = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    const response = await originalCreate(ctx);

    try {
      const user = response.user;

      // dacă nu exista customer în Stripe → îl creăm
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });

        // salvăm customer.id în Strapi
        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });

        response.user.stripeCustomerId = customer.id;
      }

    } catch (err) {
      strapi.log.error("Stripe customer error:", err);
    }

    return response;
  };
const originalLogin = plugin.controllers.auth.callback;

plugin.controllers.auth.callback = async (ctx) => {
  const response = await originalLogin(ctx);

  // include și stripeCustomerId în răspuns
  const user = response.user;

  if (user) {
    const fullUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      select: ["id", "username", "email", "stripeCustomerId"],
    });

    response.user = fullUser;
  }

  return response;
};

  return plugin;
};
